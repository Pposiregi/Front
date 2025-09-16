import { useEffect, useRef, useState } from 'react';
import { Platform } from 'react-native';
import Geolocation, {
  GeoPosition,
  GeoError,
} from 'react-native-geolocation-service';
import Pedometer from 'react-native-pedometer';

/**
 * react-native-geolocation-service를 통한 위치 추적 Hook
 * - 위치 권한은 App.tsx에서 요청
 * - 위치 변화가 있을 때마다 position 상태 업데이트
 * - 컴포넌트 언마운트 시 위치 추적 중지
 * - 현재 위치 좌표를 반환
 */
export const useMissions = () => {
  const [position, setPosition] = useState<GeoPosition | null>(null);
  const [step, setStep] = useState(0);
  const watchId = useRef<number | null>(null);
  const prevPosition = useRef<GeoPosition | null>(null);
  const totalDistance = useRef(0);
  const stopPedometerRef = useRef<null | (() => void)>(null);

  // Haversine 거리 계산: 이전 위치와 현재 위치를 입력으로 받음
  const calcDistance = (prev: GeoPosition, curr: GeoPosition) => {
    const toRad = (v: number) => (v * Math.PI) / 180;
    const R = 6371e3; // meters
    const lat1 = toRad(prev.coords.latitude);
    const lat2 = toRad(curr.coords.latitude);
    const dLat = toRad(curr.coords.latitude - prev.coords.latitude);
    const dLon = toRad(curr.coords.longitude - prev.coords.longitude);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  useEffect(() => {
    let pedometerAvailable = false;

    // 1) Pedometer 우선 사용 시도
    Pedometer.isStepCountingAvailable((error: any, isAvailable: boolean) => {
      if (!error && isAvailable) {
        pedometerAvailable = true;
        // 오늘 0시부터 카운트 시작
        const start = new Date();
        start.setHours(0, 0, 0, 0);

        Pedometer.startPedometerUpdatesFromDate(
          start.getTime(),
          (data: any) => {
            // iOS/Android: data.numberOfSteps 제공
            if (typeof data?.numberOfSteps === 'number') {
              setStep(data.numberOfSteps);
            }
          }
        );

        // 정리 함수 등록
        stopPedometerRef.current = () => {
          Pedometer.stopPedometerUpdates();
        };
      }
    });

    // 2) GPS 폴백: pedometer가 없거나 실패하면 위치 변화로 근사 걸음 수 계산
    // 배터리 최적화 옵션 적용
    const geoOptions = {
      enableHighAccuracy: false, // 필요 시 true로 승격
      distanceFilter: 5, // 최소 5m 이동 시 업데이트
      interval: 5000, // Android: 5초 간격 요청
      fastestInterval: 2000, // Android: 최단 2초
      showsBackgroundLocationIndicator: false, // iOS 상태바 인디케이터 비활성
      useSignificantChanges: Platform.OS === 'ios', // iOS: 큰 변화 기반 업데이트
    } as const;

    watchId.current = Geolocation.watchPosition(
      (pos) => {
        setPosition(pos);
        if (!pedometerAvailable && prevPosition.current) {
          const dist = calcDistance(prevPosition.current, pos); // 콜백의 pos 직접 사용
          // 0.8m 당 1보로 근사
          totalDistance.current += dist;
          setStep(Math.floor(totalDistance.current / 0.8));
        }
        prevPosition.current = pos;
      },
      (err: GeoError) => {
        console.warn('Geolocation error', err);
      },
      geoOptions as any
    );

    return () => {
      if (watchId.current !== null) {
        Geolocation.clearWatch(watchId.current);
      }
      Geolocation.stopObserving();
      if (stopPedometerRef.current) {
        stopPedometerRef.current();
      }
    };
  }, []);

  return position;
};
