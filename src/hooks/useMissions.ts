import { useEffect, useRef, useState } from 'react';
import Geolocation, {
  GeoPosition,
  GeoError,
} from 'react-native-geolocation-service';

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

  useEffect(() => {
    watchId.current = Geolocation.watchPosition(
      (pos) => {
        setPosition(pos);
        if (prevPosition.current) {
          const dist = getDistance();
          totalDistance.current += dist;
          setStep(Math.floor(totalDistance.current / 0.8)); // 0.8m 당 1보로 계산

          console.log(
            `Moved ${dist.toFixed(
              2
            )} meters, total distance: ${totalDistance.current.toFixed(
              2
            )} meters, steps: ${step}`
          );
        }
        prevPosition.current = pos;
      },
      (err: GeoError) => {
        console.warn('Geolocation error', err);
      },
      { enableHighAccuracy: true, distanceFilter: 0 }
    );

    // 두 위치 간의 거리 계산 (Haversine formula)

    const getDistance = () => {
      if (!prevPosition.current || !position) return 0;
      const toRad = (value: number) => (value * Math.PI) / 180;
      const R = 6371e3;
      const lat1 = toRad(prevPosition.current.coords.latitude);
      const lat2 = toRad(position.coords.latitude);
      const deltaLat = toRad(
        position.coords.latitude - prevPosition.current.coords.latitude
      );
      const deltaLon = toRad(
        position.coords.longitude - prevPosition.current.coords.longitude
      );
      const a =
        Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
        Math.cos(lat1) *
          Math.cos(lat2) *
          Math.sin(deltaLon / 2) *
          Math.sin(deltaLon / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      return R * c; // in meters
    };

    prevPosition.current = position;
    return () => {
      if (watchId.current !== null) {
        Geolocation.clearWatch(watchId.current);
      }
      Geolocation.stopObserving();
    };
  }, [position, step]);
  return position;
};
