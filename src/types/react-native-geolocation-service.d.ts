declare module 'react-native-geolocation-service' {
  export type GeoPosition = {
    coords: {
      latitude: number;
      longitude: number;
      accuracy: number;
      altitude?: number | null;
      altitudeAccuracy?: number | null;
      heading?: number | null;
      speed?: number | null;
    };
    timestamp: number;
  };

  export type GeoError = {
    code: number;
    message: string;
  };

  export type GeoOptions = {
    enableHighAccuracy?: boolean;
    timeout?: number;
    maximumAge?: number;
  };

  export type GeoWatchOptions = GeoOptions & {
    distanceFilter?: number;
    interval?: number;
    fastestInterval?: number;
    showsBackgroundLocationIndicator?: boolean;
  };

  export type RequestAuthorizationResult =
    | 'granted'
    | 'denied'
    | 'restricted'
    | 'disabled'
    | undefined
    | void;

  type SuccessHandler = (position: GeoPosition) => void;
  type ErrorHandler = (error: GeoError) => void;

  const Geolocation: {
    requestAuthorization?: (mode?: 'always' | 'whenInUse') =>
      | Promise<RequestAuthorizationResult>
      | RequestAuthorizationResult;
    getCurrentPosition: (
      success: SuccessHandler,
      error?: ErrorHandler,
      options?: GeoOptions
    ) => void;
    watchPosition: (
      success: SuccessHandler,
      error?: ErrorHandler,
      options?: GeoWatchOptions
    ) => number;
    clearWatch: (watchId: number) => void;
    stopObserving?: () => void;
  };

  export default Geolocation;
}
