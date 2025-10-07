import { useCallback, useEffect, useRef, useState } from 'react';
import {
  Alert,
  PermissionsAndroid,
  Platform,
  type Permission,
} from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import type { LatLng, MapRegion } from '@shared-types/location';

// 초기 지도 위치 (서울 시청)
const DEFAULT_REGION: MapRegion = {
  // 앱이 실행 중인 플랫폼에서 제공하는 좌표로 갱신되면 즉시 덮어쓴다.
  latitude: 37.5665,
  longitude: 126.978,
  latitudeDelta: 0.015,
  longitudeDelta: 0.015,
};

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
    Geolocation.stopObserving?.();
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
   * 새 좌표를 수신하면 경로 배열과 카메라 중심(region)을 최신 값으로 갱신한다.
   */
  const handlePosition = useCallback((latitude: number, longitude: number) => {
    setState((prev) => {
      const nextPath = [...prev.path, { latitude, longitude }];
      const nextRegion: MapRegion = {
        latitude,
        longitude,
        latitudeDelta: prev.region.latitudeDelta,
        longitudeDelta: prev.region.longitudeDelta,
      };

      return {
        ...prev,
        path: nextPath,
        region: nextRegion,
      };
    });
  }, []);

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

    Geolocation.getCurrentPosition(
      (position) => {
        handlePosition(position.coords.latitude, position.coords.longitude);
      },
      (error) => {
        console.warn('현재 위치를 가져오지 못했습니다.', error);
        Alert.alert('위치 오류', '현재 위치를 불러오지 못했습니다.');
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0,
      }
    );

    watchIdRef.current = Geolocation.watchPosition(
      (position) => {
        handlePosition(position.coords.latitude, position.coords.longitude);
      },
      (error) => {
        console.warn('위치 추적 중 오류 발생', error);
      },
      {
        enableHighAccuracy: true,
        // 위치가 약 10m 이상 이동하거나, 최대 3초 간격으로 콜백을 받는다.
        // 걷기(1.4m/s)~러닝(4m/s) 페이스를 고려하면 3초면 4~12m를 이동하므로
        // 실사용 시 지나치게 많은 샘플이 쌓이지 않으면서 경로가 끊기지 않는다.
        distanceFilter: 10,
        interval: 3000,
        fastestInterval: 1000,
        showsBackgroundLocationIndicator: true,
      }
    );

    return true;
  }, [handlePosition, requestPermission]);

  const stopTracking = useCallback(() => {
    clearWatch();
    setState((prev) => ({ ...prev, isTracking: false }));
  }, [clearWatch]);

  useEffect(() => () => clearWatch(), [clearWatch]);

  return {
    isTracking: state.isTracking,
    path: state.path,
    region: state.region,
    startTracking,
    stopTracking,
  };
};

export default useRouteTracking;
