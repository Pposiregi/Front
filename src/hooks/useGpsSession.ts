import { useCallback, useEffect, useRef, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { LatLng, MapRegion } from '@shared-types/location';
import { useRouteTracking, type RouteTrackPoint } from '@hooks/useRouteTracking';
import { startGpsSession, logGps, endGpsSession } from '@api/gpsApi';
import { getDistanceMeters } from '@utils/distance';
import { getHealthConnectStepCount } from '@utils/healthConnectSteps';
import type {
  GpsEndResponse,
  GpsLogRequest,
  GpsSessionStartResponse,
} from 'types/gps';

const SESSION_ID_KEY = 'fitpet:gps:sessionId';
const SESSION_START_KEY = 'fitpet:gps:startTime';

type PendingLog = Omit<GpsLogRequest, 'sessionId'>;

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

  const flushLogs = useCallback(async () => {
    const currentSessionId = sessionIdRef.current;
    if (!currentSessionId) return;
    if (pendingLogsRef.current.length === 0) return;

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
        break;
      }
    }
  }, []);

  const startLogTimer = useCallback(() => {
    clearLogTimer();
    logTimerRef.current = setInterval(() => {
      flushLogs();
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

    await flushLogs();

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

    const response = await endGpsSession({
      sessionId: sessionIdRef.current,
      endTime: endTime.toISOString(),
      stepCount,
      distance,
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

    if (__DEV__) {
      console.debug('>>>[RUNNING][RUN] 세션 종료', response?.sessionId);
    }

    return { response, summary };
  }, [clearLogTimer, clearPersistedSession, flushLogs, path, stopTracking]);

  useEffect(() => {
    if (!isTracking) return;
    if (trackPoints.length === 0) {
      lastTrackPointIndexRef.current = 0;
      return;
    }
    if (trackPoints.length <= lastTrackPointIndexRef.current) return;

    const newPoints = trackPoints.slice(lastTrackPointIndexRef.current);
    newPoints.forEach((point: RouteTrackPoint) => {
      pendingLogsRef.current.push({
        latitude: point.latitude,
        longitude: point.longitude,
        recordedAt: point.recordedAt,
        speed: point.speed,
        altitude: point.altitude,
      });
    });
    lastTrackPointIndexRef.current = trackPoints.length;
  }, [isTracking, trackPoints]);

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
