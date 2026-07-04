import { useCallback, useEffect, useRef, useState } from 'react';
import {
  Alert,
  PermissionsAndroid,
  Platform,
  type Permission,
} from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import type { LatLng, MapRegion } from '@shared/types/location';
import { getDistanceMeters } from '@utils/distance';

// 초기 지도 위치 (서울 시청 근방) — 실제 위치를 받으면 곧바로 덮어쓴다.
const DEFAULT_REGION: MapRegion = {
  latitude: 37.5665,
  longitude: 126.978,
  latitudeDelta: 0.008,
  longitudeDelta: 0.008,
};

// 추적 시 카메라가 유지할 확대 수준 (약 400m 너비)
const TRACKING_REGION_DELTA = 0.004;
// 장시간 러닝에서 좌표 배열과 렌더링 비용이 과도하게 커지지 않도록 샘플을 절제한다.
const WATCH_DISTANCE_FILTER_METERS = 5;
// GPS 튐과 제자리 샘플 누적을 방지하기 위한 최소 이동 거리
const MIN_POINT_DISTANCE_METERS = 3;

type TrackingState = {
  isTracking: boolean;
  path: LatLng[];
  trackPoints: RouteTrackPoint[];
  region: MapRegion;
};

export type RouteTrackPoint = LatLng & {
  recordedAt: string;
  speed?: number;
  altitude?: number;
  altitudeAccuracy?: number;
};

/**
 * 안드로이드에서 위치 추적을 위해 필요한 런타임 권한 집합.
 * 값이 undefined인 항목도 있음 -> 실제 사용 전에 필터링
 */
const ANDROID_PERMISSIONS = [
  PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
  PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
].filter((permission): permission is Permission => Boolean(permission));

/**
 * 안드로이드 위치 권한 확인 -> 필요한 항목만 요청
 */
const requestAndroidPermissions = async () => {
  const ungranted: Permission[] = [];

  for (const permission of ANDROID_PERMISSIONS) {
    const alreadyGranted = await PermissionsAndroid.check(permission);
    if (!alreadyGranted) ungranted.push(permission);
  }

  if (ungranted.length === 0) {
    return true;
  }

  const result = await PermissionsAndroid.requestMultiple(ungranted);
  return ungranted.every(
    (permission) => result[permission] === PermissionsAndroid.RESULTS.GRANTED
  );
};

/**
 * 실시간 경로 추적 훅.
 * - 위치 권한 요청
 * - 위치 워치 시작/종료
 * - 폴리라인 좌표/카메라 영역 관리
 */
export const useRouteTracking = () => {
  const [state, setState] = useState<TrackingState>({
    isTracking: false,
    path: [],
    trackPoints: [],
    region: DEFAULT_REGION,
  });
  const watchIdRef = useRef<number | null>(null);
  const refreshTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const lastUpdateRef = useRef<number | null>(null);

  /**
   * Resurce Deallocation
   * 백그라운드에서 돌아가는 위치 워치(Geolocation.watchPosition) 자원해제
   */
  /**
   * 위치 워치를 해제한다.
   */
  const clearWatch = useCallback(() => {
    if (watchIdRef.current !== null) {
      try {
        Geolocation.clearWatch(watchIdRef.current);
      } catch (error) {
        console.warn('Failed to clear location watch', error);
      }
      watchIdRef.current = null;
    }
  }, []);

  /**
   * 보조 위치 갱신 타이머를 해제한다.
   */
  const clearRefreshTimer = useCallback(() => {
    if (refreshTimerRef.current) {
      clearInterval(refreshTimerRef.current);
      refreshTimerRef.current = null;
    }
  }, []);

  /**
   * 플랫폼별 위치 권한을 요청한다.
   * - Android만 목표로 한다
   */
  const requestPermission = useCallback(async () => {
    if (Platform.OS === 'android') {
      return requestAndroidPermissions();
    }
  }, []);

  /**
   * 위치 업데이트 처리
   * - 좌표 유효성 검사
   * - 지터 필터링
   * - 경로/카메라 갱신
   */
  const handlePosition = useCallback(
    ({
      latitude,
      longitude,
      speed,
      altitude,
      altitudeAccuracy,
      timestamp,
    }: {
      latitude: number;
      longitude: number;
      speed?: number | null;
      altitude?: number | null;
      altitudeAccuracy?: number | null;
      timestamp?: number;
    }) => {
      if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
        console.warn('Received invalid coordinate', { latitude, longitude });
        return;
      }

      const safeSpeed =
        Number.isFinite(speed) && (speed ?? 0) >= 0 ? Number(speed) : undefined;
      const safeAltitude = Number.isFinite(altitude)
        ? Number(altitude)
        : undefined;
      const safeAltitudeAccuracy =
        Number.isFinite(altitudeAccuracy) && (altitudeAccuracy ?? 0) >= 0
          ? Number(altitudeAccuracy)
          : undefined;
      const recordedAt = new Date(
        Number.isFinite(timestamp) ? Number(timestamp) : Date.now()
      ).toISOString();

      setState((prev) => {
        const nextPoint: LatLng = { latitude, longitude };
        const nextTrackPoint: RouteTrackPoint = {
          latitude,
          longitude,
          recordedAt,
          speed: safeSpeed,
          altitude: safeAltitude,
          altitudeAccuracy: safeAltitudeAccuracy,
        };
        const lastPoint = prev.path[prev.path.length - 1];

        if (lastPoint) {
          const delta = getDistanceMeters(lastPoint, nextPoint);
          // GPS 소수점 떨림(수십 cm)을 중복 포인트로 추가하지 않도록 필터링한다.
          if (delta < MIN_POINT_DISTANCE_METERS) {
            lastUpdateRef.current = Date.now();
            return prev;
          }
        }

        const nextPath = [...prev.path, nextPoint];
        const nextTrackPoints = [...prev.trackPoints, nextTrackPoint];
        const nextRegion: MapRegion = {
          latitude,
          longitude,
          latitudeDelta: TRACKING_REGION_DELTA,
          longitudeDelta: TRACKING_REGION_DELTA,
        };

        lastUpdateRef.current = Date.now();

        return {
          ...prev,
          path: nextPath,
          trackPoints: nextTrackPoints,
          region: nextRegion,
        };
      });
    },
    []
  );

  /**
   * 단일 현재 위치를 요청한다.
   */
  const requestSingleLocation = useCallback(() => {
    Geolocation.getCurrentPosition(
      (position) => {
        handlePosition({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          speed: position.coords.speed,
          altitude: position.coords.altitude,
          altitudeAccuracy: position.coords.altitudeAccuracy,
          timestamp: position.timestamp,
        });
      },
      (error) => {
        console.warn('현재 위치를 가져오지 못했습니다.', error);
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0,
        forceRequestLocation: true,
      }
    );
  }, [handlePosition]);

  /**
   * 위치 추적 시작
   * - 권한 확인
   * - 워치/타이머 초기화 및 등록
   */
  const startTracking = useCallback(async () => {
    const granted = await requestPermission();

    if (!granted) {
      Alert.alert(
        '위치 권한 필요',
        '경로를 기록하려면 위치 접근 권한을 허용해 주세요.'
      );
      return false;
    }

    // 재시작 시 중복(빠른 토글 눌림으로 인한) 워치/타이머 누적을 방지하기 위해 기존 자원을 정리한다.
    clearWatch();
    clearRefreshTimer();

    setState((prev) => ({
      ...prev,
      isTracking: true,
      path: [],
      trackPoints: [],
    }));
    lastUpdateRef.current = null;

    requestSingleLocation();

    watchIdRef.current = Geolocation.watchPosition(
      (position) => {
        handlePosition({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          speed: position.coords.speed,
          altitude: position.coords.altitude,
          altitudeAccuracy: position.coords.altitudeAccuracy,
          timestamp: position.timestamp,
        });
      },
      (error) => {
        console.warn('위치 추적 중 오류 발생', error);
      },
      {
        enableHighAccuracy: true,
        distanceFilter: WATCH_DISTANCE_FILTER_METERS,
        interval: 5000,
        fastestInterval: 3000,
        showsBackgroundLocationIndicator: true,
      }
    );

    refreshTimerRef.current = setInterval(() => {
      if (watchIdRef.current === null) return;
      const last = lastUpdateRef.current;
      if (!last || Date.now() - last > 9000) {
        requestSingleLocation();
      }
    }, 8000);

    return true;
  }, [
    clearRefreshTimer,
    clearWatch,
    handlePosition,
    requestPermission,
    requestSingleLocation,
  ]);

  /**
   * 위치 추적을 종료한다.
   */
  const stopTracking = useCallback(() => {
    clearWatch();
    clearRefreshTimer();
    lastUpdateRef.current = null;
    setState((prev) => ({ ...prev, isTracking: false }));
  }, [clearRefreshTimer, clearWatch]);

  useEffect(
    () => () => {
      clearRefreshTimer();
      clearWatch();
    },
    [clearRefreshTimer, clearWatch]
  );

  return {
    isTracking: state.isTracking,
    path: state.path,
    trackPoints: state.trackPoints,
    region: state.region,
    startTracking,
    stopTracking,
  };
};

export default useRouteTracking;
