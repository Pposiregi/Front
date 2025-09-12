import { useEffect, useRef, useState } from 'react';
import Geolocation, {
  GeoPosition,
  GeoError,
} from 'react-native-geolocation-service';

/**
 * Hook to watch user location using react-native-geolocation-service.
 */
export const useMissions = () => {
  const [position, setPosition] = useState<GeoPosition | null>(null);
  const watchId = useRef<number | null>(null);

  useEffect(() => {
    watchId.current = Geolocation.watchPosition(
      (pos) => setPosition(pos),
      (err: GeoError) => {
        console.warn('Geolocation error', err);
      },
      { enableHighAccuracy: true, distanceFilter: 0 }
    );
    return () => {
      if (watchId.current !== null) {
        Geolocation.clearWatch(watchId.current);
      }
      Geolocation.stopObserving();
    };
  }, []);

  return position;
};
