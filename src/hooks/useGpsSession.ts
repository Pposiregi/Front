import { useCallback, useEffect, useRef, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { LatLng, MapRegion } from '@shared-types/location';
import { useRouteTracking, type RouteTrackPoint } from '@hooks/useRouteTracking';
import { startGpsSession, logGps, endGpsSession } from '@api/gpsApi';
import { getDistanceMeters } from '@utils/distance';
import { getHealthConnectStepCount } from '@utils/healthConnectSteps';
import type {
  GpsEndRequest,
  GpsEndResponse,
  GpsLogRequest,
  GpsSessionStartResponse,
} from 'types/gps';

const SESSION_ID_KEY = 'fitpet:gps:sessionId';
const SESSION_START_KEY = 'fitpet:gps:startTime';
const LOG_FLUSH_MAX_ATTEMPTS = 3;
const END_API_MAX_ATTEMPTS = 3;
const RETRY_BASE_DELAY_MS = 600;

type PendingLog = Omit<GpsLogRequest, 'sessionId'>;
type FlushLogsResult = {
  ok: boolean;
  retryable: boolean;
};

const wait = (ms: number) =>
  new Promise<void>((resolve) => {
    setTimeout(resolve, ms);
  });

const getRetryDelayMs = (attempt: number) =>
  RETRY_BASE_DELAY_MS * 2 ** attempt;

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

const calculateTotalDistanceMeters = (path: LatLng[]): number => {
  if (path.length < 2) return 0;
  let total = 0;
  for (let i = 1; i < path.length; i += 1) {
    total += getDistanceMeters(path[i - 1], path[i]);
  }
  return total;
};

export type EndSessionOptions = {
  /**
   * Health Connect를 건너뛰고 강제 종료한다.
   * stepCount는 0으로 처리되고 요약에 미집계 표시가 포함된다.
   */
  forceNoSteps?: boolean;
};

export type UseGpsSessionResult = {
  isTracking: boolean;
  isSessionActive: boolean;
  sessionId: number | null;
  path: LatLng[];
  region: MapRegion;
  startSession: () => Promise<boolean>;
  endSession: (
    options?: EndSessionOptions
  ) => Promise<GpsSessionEndResult | null>;
};

export type GpsSessionSummary = {
  durationMs: number;
  stepCount: number;
  distanceMeters: number;
  avgSpeedKmh: number;
  stepCountMissing?: boolean;
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

  const persistSession = useCallback(async (session: GpsSessionStartResponse) => {
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
  }, []);

  const clearPersistedSession = useCallback(async () => {
    try {
      await AsyncStorage.multiRemove([SESSION_ID_KEY, SESSION_START_KEY]);
    } catch (err) {
      if (__DEV__) {
        console.warn('>>>[RUNNING][RUN] 세션 삭제 실패', err);
      }
    }
  }, []);

  const appendNewTrackPointsToPending = useCallback(() => {
    const latestTrackPoints = trackPointsRef.current;
    if (latestTrackPoints.length <= lastTrackPointIndexRef.current) return;

    const newPoints = latestTrackPoints.slice(lastTrackPointIndexRef.current);
    newPoints.forEach((point: RouteTrackPoint) => {
      pendingLogsRef.current.push({
        latitude: point.latitude,
        longitude: point.longitude,
        recordedAt: point.recordedAt,
        speed: point.speed,
        altitude: point.altitude,
      });
    });
    lastTrackPointIndexRef.current = latestTrackPoints.length;
  }, []);

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

  const endSession = useCallback(async (options?: EndSessionOptions) => {
    if (!sessionIdRef.current || !startTimeRef.current) return null;

    try {
      isEndingRef.current = true;
      clearLogTimer();
      const allLogsFlushed = await flushAllPendingLogs();
      if (!allLogsFlushed) {
        throw new Error(
          'GPS 로그 전송에 실패해 종료를 완료하지 못했습니다. 네트워크를 확인한 뒤 다시 시도해주세요.'
        );
      }

      const endTime = new Date();
      const startTimeValue = new Date(startTimeRef.current);
      const durationMs = Math.max(
        0,
        endTime.getTime() - startTimeValue.getTime()
      );
      const distance = calculateTotalDistanceMeters(path);
      const avgSpeedKmh =
        durationMs > 0 ? (distance / durationMs) * 3600 : 0;
      let stepCount = 0;
      let stepCountMissing = false;
      if (options?.forceNoSteps) {
        stepCountMissing = true;
        if (__DEV__) {
          console.warn('>>>[RUNNING][RUN] 강제 종료: 걸음 수 미집계');
        }
      } else {
        stepCount = await getHealthConnectStepCount(
          startTimeRef.current,
          endTime
        );
        if (__DEV__) {
          console.log('>>>[RUNNING][HC] 세션 구간 걸음 수', {
            startTime: startTimeRef.current,
            endTime: endTime.toISOString(),
            stepCount,
          });
        }
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
        avgSpeedKmh,
        stepCountMissing,
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
    clearLogTimer,
    clearPersistedSession,
    endGpsSessionWithRetry,
    flushAllPendingLogs,
    path,
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
    region,
    startSession,
    endSession,
  };
};

export default useGpsSession;
