import { useCallback, useEffect, useRef, useState } from 'react';
import {
  Alert,
  PermissionsAndroid,
  Platform,
  type Permission,
} from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import type { LatLng, MapRegion } from '@shared-types/location';

// 초기 지도 위치 (서울 시청 근방) — 실제 위치를 받으면 곧바로 덮어쓴다.
const DEFAULT_REGION: MapRegion = {
  latitude: 37.5665,
  longitude: 126.978,
  latitudeDelta: 0.008,
  longitudeDelta: 0.008,
};

// 추적 시 카메라가 유지할 확대 수준 (약 400m 너비)
const TRACKING_REGION_DELTA = 0.004;
// 위치 샘플 사이 간격이 너무 크면 폴리라인이 안 그려질 수 있어 최소 이동 거리를 낮춘다.
const WATCH_DISTANCE_FILTER_METERS = 0;
// GPS가 수십 cm 단위로 튀는 것을 방지하기 위한 최소 거리
const MIN_POINT_DISTANCE_METERS = 0.1;

type TrackingState = {
  isTracking: boolean;
  path: LatLng[];
  region: MapRegion;
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
 * 지정한 필수권한 가운데 거부된 항목 재요청
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

/* ios SKIP!! */
const requestIOSPermission = async () => {
  try {
    type IOSAuthStatus =
      | 'granted'
      | 'denied'
      | 'restricted'
      | 'disabled'
      | 'authorized';

    const status = (await Geolocation.requestAuthorization?.('whenInUse')) as
      | IOSAuthStatus
      | undefined;
    if (!status) return true;
    return status === 'granted' || status === 'authorized';
  } catch (error) {
    console.warn('Location permission request failed', error);
    return false;
  }
};

export const useRouteTracking = () => {
  const [state, setState] = useState<TrackingState>({
    isTracking: false,
    path: [],
    region: DEFAULT_REGION,
  });
  const watchIdRef = useRef<number | null>(null);
  const refreshTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const lastUpdateRef = useRef<number | null>(null);

  /**
   * Resurce Deallocation
   * 백그라운드에서 돌아가는 위치 워치(Geolocation.watchPosition) 자원해제
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

  const clearRefreshTimer = useCallback(() => {
    if (refreshTimerRef.current) {
      clearInterval(refreshTimerRef.current);
      refreshTimerRef.current = null;
    }
  }, []);

  /**
   * 플랫폼별 위치 권한을 요청하고, 허용 여부를 boolean으로 반환한다.
   */
  const requestPermission = useCallback(async () => {
    if (Platform.OS === 'android') {
      return requestAndroidPermissions();
    }

    return requestIOSPermission();
  }, []);

  /**
   * 두 좌표 사이 거리를 미터 단위로 계산한다. (하버사인)
   */
  const getDistanceMeters = useCallback((a: LatLng, b: LatLng) => {
    const toRad = (value: number) => (value * Math.PI) / 180;
    const R = 6371e3; // 지구 반지름 (m)
    const dLat = toRad(b.latitude - a.latitude);
    const dLon = toRad(b.longitude - a.longitude);
    const lat1 = toRad(a.latitude);
    const lat2 = toRad(b.latitude);

    const sinLat = Math.sin(dLat / 2);
    const sinLon = Math.sin(dLon / 2);

    const aVal =
      sinLat * sinLat + Math.cos(lat1) * Math.cos(lat2) * sinLon * sinLon;
    const c = 2 * Math.atan2(Math.sqrt(aVal), Math.sqrt(1 - aVal));

    return R * c;
  }, []);

  /**
   * 새 좌표를 수신하면 경로 배열과 카메라 중심(region)을 최신 값으로 갱신한다.
   */
  const handlePosition = useCallback(
    (latitude: number, longitude: number) => {
      if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
        console.warn('Received invalid coordinate', { latitude, longitude });
        return;
      }
      setState((prev) => {
        const nextPoint: LatLng = { latitude, longitude };
        const lastPoint = prev.path[prev.path.length - 1];

        if (lastPoint) {
          const delta = getDistanceMeters(lastPoint, nextPoint);
          // GPS 소수점 떨림(수십 cm)을 중복 포인트로 추가하지 않도록 필터링한다.
          if (delta < MIN_POINT_DISTANCE_METERS) {
            if (__DEV__) {
              console.debug('[RouteTracking] ignore jitter', {
                latitude,
                longitude,
                delta,
              });
            }
            lastUpdateRef.current = Date.now();
            return prev;
          }
        }

        const nextPath = [...prev.path, nextPoint];
        const nextRegion: MapRegion = {
          latitude,
          longitude,
          latitudeDelta: TRACKING_REGION_DELTA,
          longitudeDelta: TRACKING_REGION_DELTA,
        };

        if (__DEV__) {
          console.debug('[RouteTracking] push point', {
            latitude,
            longitude,
            nextLength: nextPath.length,
          });
        }

        lastUpdateRef.current = Date.now();

        return {
          ...prev,
          path: nextPath,
          region: nextRegion,
        };
      });
    },
    [getDistanceMeters]
  );

  const requestSingleLocation = useCallback(() => {
    Geolocation.getCurrentPosition(
      (position) => {
        handlePosition(position.coords.latitude, position.coords.longitude);
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
   * 권한을 확인한 뒤 현재 위치를 기준으로 워치를 등록하고, 추적 상태를 true로 만든다.
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

    setState((prev) => ({ ...prev, isTracking: true, path: [] }));
    lastUpdateRef.current = null;

    requestSingleLocation();

    watchIdRef.current = Geolocation.watchPosition(
      (position) => {
        handlePosition(position.coords.latitude, position.coords.longitude);
      },
      (error) => {
        console.warn('위치 추적 중 오류 발생', error);
      },
      {
        enableHighAccuracy: true,
        distanceFilter: WATCH_DISTANCE_FILTER_METERS,
        interval: 2000,
        fastestInterval: 1000,
        showsBackgroundLocationIndicator: true,
      }
    );

    refreshTimerRef.current = setInterval(() => {
      if (watchIdRef.current === null) return;
      const last = lastUpdateRef.current;
      if (!last || Date.now() - last > 4000) {
        if (__DEV__) {
          console.debug('[RouteTracking] force single location');
        }
        requestSingleLocation();
      }
    }, 4000);

    return true;
  }, [handlePosition, requestPermission, requestSingleLocation]);

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
    region: state.region,
    startTracking,
    stopTracking,
  };
};

export default useRouteTracking;
