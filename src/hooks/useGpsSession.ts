import { useCallback, useEffect, useRef, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { LatLng, MapRegion } from '@shared/types/location';
import {
  useRouteTracking,
  type RouteTrackPoint,
} from '@hooks/useRouteTracking';
import { useNativeStepCounter } from '@hooks/useNativeStepCounter';
import { startGpsSession, logGps, endGpsSession } from '@api/gpsApi';
import {
  calculateTotalDistanceMeters,
  calculateTotalSlopeDistanceMeters,
} from '@utils/distance';
import type {
  GpsEndRequest,
  GpsEndResponse,
  GpsLogRequest,
  GpsSessionStartResponse,
} from 'types/gps';

const SESSION_ID_KEY = 'slimpet:gps:sessionId';
const SESSION_START_KEY = 'slimpet:gps:startTime';
const LOG_FLUSH_MAX_ATTEMPTS = 3;
const END_API_MAX_ATTEMPTS = 3;
const RETRY_BASE_DELAY_MS = 600;
// 이 값(m)보다 GPS 평균 오차 반경이 크면 "GPS 신호 불량"으로 간주한다.
const ACCURACY_BAD_THRESHOLD_METERS = 30;
const MIN_RUNNING_STEP_LENGTH_METERS = 0.78;
const EASY_RUNNING_STEP_LENGTH_METERS = 0.85;
const STEADY_RUNNING_STEP_LENGTH_METERS = 0.92;
const FAST_RUNNING_STEP_LENGTH_METERS = 1.0;
const VERY_FAST_RUNNING_STEP_LENGTH_METERS = 1.08;

type PendingLog = Omit<GpsLogRequest, 'sessionId'>;
type FlushLogsResult = {
  ok: boolean;
  retryable: boolean;
};

/** 지정한 시간만큼 대기하는 Promise 유틸이다. */
const wait = (ms: number) =>
  new Promise<void>((resolve) => {
    setTimeout(resolve, ms);
  });

/** 재시도 횟수에 따른 exponential backoff 지연 시간을 계산한다. */
const getRetryDelayMs = (attempt: number) => RETRY_BASE_DELAY_MS * 2 ** attempt;

/** 위치 SDK의 m/s 속도를 서버 전송용 km/h 값으로 변환한다. */
const toKmh = (speedMps?: number) => {
  // 위치 SDK speed(m/s)를 /gps/log 전송 규격(km/h)으로 맞춘다.
  if (!Number.isFinite(speedMps)) return undefined;
  return Number(speedMps) * 3.6;
};

/** 실패가 재시도 가능한 네트워크 계열인지 판단한다. */
const isRetryableNetworkError = (error: unknown): boolean => {
  const maybe = error as {
    code?: string;
    request?: unknown;
    response?: { status?: number };
  };
  const status = maybe?.response?.status;
  if (typeof status === 'number') {
    return status >= 500 || status === 429;
  }
  const code = maybe?.code;
  if (
    code === 'ERR_NETWORK' ||
    code === 'ECONNABORTED' ||
    code === 'ETIMEDOUT' ||
    code === 'ENETUNREACH'
  ) {
    return true;
  }
  return maybe?.request != null && maybe?.response == null;
};

/** track point들의 평균 GPS 오차 반경(m)을 계산한다. 값이 없으면 null. */
const calculateAverageAccuracy = (points: RouteTrackPoint[]): number | null => {
  const values = points
    .map((p) => p.accuracy)
    .filter((v): v is number => Number.isFinite(v));
  if (values.length === 0) return null;
  return values.reduce((a, b) => a + b, 0) / values.length;
};

/**
 * 평균 속도를 바탕으로 러닝 보폭을 추정한다.
 * 실제 step source가 없기 때문에, 고정 걷기 보폭 대신 속도 구간별 stride를 사용한다.
 */
const getEstimatedRunningStepLengthMeters = (avgSpeedMps: number) => {
  if (!Number.isFinite(avgSpeedMps) || avgSpeedMps <= 0) {
    return EASY_RUNNING_STEP_LENGTH_METERS;
  }
  if (avgSpeedMps < 2.0) {
    return MIN_RUNNING_STEP_LENGTH_METERS;
  }
  if (avgSpeedMps < 2.5) {
    return EASY_RUNNING_STEP_LENGTH_METERS;
  }
  if (avgSpeedMps < 3.0) {
    return STEADY_RUNNING_STEP_LENGTH_METERS;
  }
  if (avgSpeedMps < 3.5) {
    return FAST_RUNNING_STEP_LENGTH_METERS;
  }
  return VERY_FAST_RUNNING_STEP_LENGTH_METERS;
};

export type UseGpsSessionResult = {
  isTracking: boolean;
  isSessionActive: boolean;
  sessionId: number | null;
  path: LatLng[];
  trackPoints: RouteTrackPoint[];
  region: MapRegion;
  liveSteps: number;
  startSession: () => Promise<boolean>;
  endSession: () => Promise<GpsSessionEndResult | null>;
};

export type GpsSessionSummary = {
  durationMs: number;
  stepCount: number;
  distanceMeters: number;
  avgSpeedMps: number;
};

export type GpsSessionEndResult = {
  response: GpsEndResponse;
  summary: GpsSessionSummary;
};

/**
 * GPS 세션 라이프사이클 훅
 * - /gps/start 호출 및 sessionId 저장
 * - 5초 주기 GPS 로그 버퍼링/전송
 * - 종료 시 distance + stepCount 집계 후 /gps/end 호출
 * - 필요 시 AsyncStorage에 sessionId/startTime 보관
 */
export const useGpsSession = (): UseGpsSessionResult => {
  const { isTracking, path, trackPoints, region, startTracking, stopTracking } =
    useRouteTracking();
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [sessionId, setSessionId] = useState<number | null>(null);
  const { steps: liveSteps, stepsRef: liveStepsRef } =
    useNativeStepCounter(isTracking);

  const sessionIdRef = useRef<number | null>(null);
  const startTimeRef = useRef<string | null>(null);
  const logTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const pendingLogsRef = useRef<PendingLog[]>([]);
  const lastTrackPointIndexRef = useRef(0);
  const isEndingRef = useRef(false);
  const trackPointsRef = useRef<RouteTrackPoint[]>([]);

  const clearLogTimer = useCallback(() => {
    if (!logTimerRef.current) return;
    clearInterval(logTimerRef.current);
    logTimerRef.current = null;
  }, []);

  const persistSession = useCallback(
    async (session: GpsSessionStartResponse) => {
      try {
        await AsyncStorage.setItem(SESSION_ID_KEY, String(session.sessionId));
        if (startTimeRef.current) {
          await AsyncStorage.setItem(SESSION_START_KEY, startTimeRef.current);
        }
      } catch (err) {
        if (__DEV__) {
          console.warn('>>>[RUNNING][RUN] 세션 저장 실패', err);
        }
      }
    },
    []
  );

  const clearPersistedSession = useCallback(async () => {
    try {
      await AsyncStorage.multiRemove([SESSION_ID_KEY, SESSION_START_KEY]);
    } catch (err) {
      if (__DEV__) {
        console.warn('>>>[RUNNING][RUN] 세션 삭제 실패', err);
      }
    }
  }, []);

  const appendTrackPointsToPending = useCallback(
    (points: RouteTrackPoint[]) => {
      if (points.length <= lastTrackPointIndexRef.current) return;

      const newPoints = points.slice(lastTrackPointIndexRef.current);
      newPoints.forEach((point: RouteTrackPoint) => {
        pendingLogsRef.current.push({
          latitude: point.latitude,
          longitude: point.longitude,
          recordedAt: point.recordedAt,
          // /gps/log 전송 단위는 km/h로 맞춘다.
          speed: toKmh(point.speed),
          altitude: point.altitude,
        });
      });
      lastTrackPointIndexRef.current = points.length;
    },
    []
  );

  const appendNewTrackPointsToPending = useCallback(() => {
    appendTrackPointsToPending(trackPointsRef.current);
  }, [appendTrackPointsToPending]);

  const flushLogs = useCallback(async (): Promise<FlushLogsResult> => {
    const currentSessionId = sessionIdRef.current;
    if (!currentSessionId) return { ok: false, retryable: false };
    if (pendingLogsRef.current.length === 0) {
      return { ok: true, retryable: false };
    }

    const logsToSend = pendingLogsRef.current;
    pendingLogsRef.current = [];

    for (let i = 0; i < logsToSend.length; i += 1) {
      const log = logsToSend[i];
      try {
        await logGps({ sessionId: currentSessionId, ...log });
      } catch (err) {
        if (__DEV__) {
          console.error('>>>[RUNNING][RUN] GPS 로그 전송 실패', err);
        }
        // 실패한 로그와 남은 로그를 다시 큐에 적재
        pendingLogsRef.current = [
          log,
          ...logsToSend.slice(i + 1),
          ...pendingLogsRef.current,
        ];
        return { ok: false, retryable: isRetryableNetworkError(err) };
      }
    }
    return { ok: pendingLogsRef.current.length === 0, retryable: false };
  }, []);

  const flushAllPendingLogs = useCallback(
    async (maxAttempts = LOG_FLUSH_MAX_ATTEMPTS): Promise<boolean> => {
      for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
        const result = await flushLogs();
        if (result.ok && pendingLogsRef.current.length === 0) {
          return true;
        }
        if (!result.retryable) {
          return false;
        }
        if (attempt < maxAttempts - 1) {
          const delay = getRetryDelayMs(attempt);
          if (__DEV__) {
            console.warn(
              '>>>[RUNNING][RUN] 로그 재전송 대기',
              JSON.stringify({ attempt: attempt + 1, delay })
            );
          }
          await wait(delay);
        }
      }
      return pendingLogsRef.current.length === 0;
    },
    [flushLogs]
  );

  const endGpsSessionWithRetry = useCallback(
    async (
      payload: GpsEndRequest,
      maxAttempts = END_API_MAX_ATTEMPTS
    ): Promise<GpsEndResponse> => {
      let lastError: unknown = null;
      for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
        try {
          return await endGpsSession(payload);
        } catch (err) {
          lastError = err;
          if (!isRetryableNetworkError(err) || attempt === maxAttempts - 1) {
            throw err;
          }
          const delay = getRetryDelayMs(attempt);
          if (__DEV__) {
            console.warn(
              '>>>[RUNNING][API] /gps/end 재시도 대기',
              JSON.stringify({ attempt: attempt + 1, delay })
            );
          }
          await wait(delay);
        }
      }
      throw lastError ?? new Error('/gps/end 재시도에 실패했습니다.');
    },
    []
  );

  const startLogTimer = useCallback(() => {
    clearLogTimer();
    logTimerRef.current = setInterval(() => {
      flushLogs().catch((err) => {
        if (__DEV__) {
          console.error('>>>[RUNNING][RUN] 주기 로그 전송 실패', err);
        }
      });
    }, 5000);
  }, [clearLogTimer, flushLogs]);

  const startSession = useCallback(async () => {
    if (isSessionActive) return false;

    const startTime = new Date();
    const trackingStarted = await startTracking();
    if (!trackingStarted) return false;

    try {
      const response = await startGpsSession({
        startTime: startTime.toISOString(),
      });
      sessionIdRef.current = response.sessionId;
      startTimeRef.current = startTime.toISOString();
      setSessionId(response.sessionId);
      setIsSessionActive(true);
      isEndingRef.current = false;
      lastTrackPointIndexRef.current = 0;
      pendingLogsRef.current = [];
      await persistSession(response);
      startLogTimer();
      if (__DEV__) {
        console.debug('>>>[RUNNING][RUN] 세션 시작', response.sessionId);
      }
      return true;
    } catch (err) {
      stopTracking();
      throw err;
    }
  }, [
    isSessionActive,
    persistSession,
    startLogTimer,
    startTracking,
    stopTracking,
  ]);

  const endSession = useCallback(async () => {
    if (!sessionIdRef.current || !startTimeRef.current) return null;

    try {
      const endTime = new Date();
      const pathSnapshot = [...path];
      const trackPointsSnapshot = [...trackPoints];

      isEndingRef.current = true;
      clearLogTimer();
      appendTrackPointsToPending(trackPointsSnapshot);
      const allLogsFlushed = await flushAllPendingLogs();
      if (!allLogsFlushed) {
        throw new Error(
          'GPS 로그 전송에 실패해 종료를 완료하지 못했습니다. 네트워크를 확인한 뒤 다시 시도해주세요.'
        );
      }

      const startTimeValue = new Date(startTimeRef.current);
      const durationMs = Math.max(
        0,
        endTime.getTime() - startTimeValue.getTime()
      );
      const horizontalDistance = calculateTotalDistanceMeters(pathSnapshot);
      const gpsDistance =
        trackPointsSnapshot.length >= 2
          ? calculateTotalSlopeDistanceMeters(trackPointsSnapshot)
          : horizontalDistance;
      // 센서 실측값 우선, 미지원 기기에서는 GPS 기반 추정값으로 fallback한다.
      const sensorSteps = liveStepsRef.current;

      // 걸음수는 흔들기 등으로도 오탐될 수 있어, "GPS 신호 자체가 나쁜지"는
      // 걸음수와의 괴리가 아니라 실측 오차 반경(accuracy)으로 판단한다.
      const avgAccuracy = calculateAverageAccuracy(trackPointsSnapshot);
      const isGpsSignalBad =
        avgAccuracy != null && avgAccuracy > ACCURACY_BAD_THRESHOLD_METERS;
      const stepBasedDistance =
        sensorSteps > 0 ? sensorSteps * EASY_RUNNING_STEP_LENGTH_METERS : 0;
      const distance =
        isGpsSignalBad && stepBasedDistance > 0
          ? stepBasedDistance
          : gpsDistance;

      // backend 기준 단위(m/s)로 요약 속도를 관리한다.
      const avgSpeedMps = durationMs > 0 ? (distance / durationMs) * 1000 : 0;
      const estimatedStepLengthMeters =
        getEstimatedRunningStepLengthMeters(avgSpeedMps);
      const stepCount =
        sensorSteps > 0
          ? sensorSteps
          : Math.max(0, Math.round(distance / estimatedStepLengthMeters));
      if (__DEV__) {
        console.log('>>>[RUNNING][RUN] 세션 자체 걸음 수 계산', {
          distanceMeters: distance,
          horizontalDistanceMeters: horizontalDistance,
          gpsDistance,
          slopeDistanceDeltaMeters: gpsDistance - horizontalDistance,
          avgAccuracy,
          isGpsSignalBad,
          avgSpeedMps,
          sensorSteps,
          stepLengthMeters: estimatedStepLengthMeters,
          stepCount,
        });
      }

      const response = await endGpsSessionWithRetry({
        sessionId: sessionIdRef.current,
        endTime: endTime.toISOString(),
        stepCount,
      });
      const summary: GpsSessionSummary = {
        durationMs,
        stepCount,
        distanceMeters: distance,
        avgSpeedMps,
      };

      clearLogTimer();
      pendingLogsRef.current = [];
      lastTrackPointIndexRef.current = 0;
      sessionIdRef.current = null;
      startTimeRef.current = null;
      setSessionId(null);
      setIsSessionActive(false);
      await clearPersistedSession();
      stopTracking();
      isEndingRef.current = false;

      if (__DEV__) {
        console.debug('>>>[RUNNING][RUN] 세션 종료', response?.sessionId);
      }

      return { response, summary };
    } catch (err) {
      // 종료 실패 시 세션/큐를 유지하고 주기 전송을 재개한다.
      isEndingRef.current = false;
      appendNewTrackPointsToPending();
      startLogTimer();
      throw err;
    }
  }, [
    appendNewTrackPointsToPending,
    appendTrackPointsToPending,
    clearLogTimer,
    clearPersistedSession,
    endGpsSessionWithRetry,
    flushAllPendingLogs,
    liveStepsRef,
    path,
    trackPoints,
    startLogTimer,
    stopTracking,
  ]);

  useEffect(() => {
    if (!isTracking) return;
    trackPointsRef.current = trackPoints;
    if (trackPoints.length === 0) {
      lastTrackPointIndexRef.current = 0;
      return;
    }
    if (isEndingRef.current) return;
    appendNewTrackPointsToPending();
  }, [appendNewTrackPointsToPending, isTracking, trackPoints]);

  useEffect(
    () => () => {
      clearLogTimer();
    },
    [clearLogTimer]
  );

  return {
    isTracking,
    isSessionActive,
    sessionId,
    path,
    trackPoints,
    region,
    liveSteps,
    startSession,
    endSession,
  };
};

export default useGpsSession;
