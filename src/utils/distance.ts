import type { LatLng } from '@shared/types/location';

export type AltitudePoint = LatLng & {
  altitude?: number | null;
  altitudeAccuracy?: number | null;
};

const MAX_REASONABLE_GRADE = 0.35;
const SHORT_SEGMENT_DISTANCE_METERS = 3;
const SHORT_SEGMENT_MAX_VERTICAL_DELTA_METERS = 2;
const MAX_ALTITUDE_ACCURACY_METERS = 20;

/**
 * 두 좌표 간 2D 수평 거리를 하버사인 공식으로 계산한다. (미터)
 */
export const getDistanceMeters = (a: LatLng, b: LatLng): number => {
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
};

const isFiniteAltitude = (
  altitude: AltitudePoint['altitude']
): altitude is number => Number.isFinite(altitude);

const hasUsableAltitudeAccuracy = (point: AltitudePoint): boolean =>
  !Number.isFinite(point.altitudeAccuracy) ||
  Number(point.altitudeAccuracy) <= MAX_ALTITUDE_ACCURACY_METERS;

const shouldUseAltitudeDelta = (
  horizontalDistance: number,
  verticalDelta: number
) => {
  const absVerticalDelta = Math.abs(verticalDelta);

  if (
    horizontalDistance < SHORT_SEGMENT_DISTANCE_METERS &&
    absVerticalDelta > SHORT_SEGMENT_MAX_VERTICAL_DELTA_METERS
  ) {
    return false;
  }

  if (horizontalDistance <= 0) {
    return absVerticalDelta <= SHORT_SEGMENT_MAX_VERTICAL_DELTA_METERS;
  }

  return absVerticalDelta / horizontalDistance <= MAX_REASONABLE_GRADE;
};

/**
 * 두 좌표 간 경사거리(3D path length)를 계산한다.
 * 고도값이 없거나 비현실적인 고도 변화가 감지되면 2D 수평 거리로 fallback한다.
 */
export const getSlopeDistanceMeters = (
  a: AltitudePoint,
  b: AltitudePoint
): number => {
  const horizontalDistance = getDistanceMeters(a, b);

  if (!isFiniteAltitude(a.altitude) || !isFiniteAltitude(b.altitude)) {
    return horizontalDistance;
  }

  if (!hasUsableAltitudeAccuracy(a) || !hasUsableAltitudeAccuracy(b)) {
    return horizontalDistance;
  }

  const verticalDelta = b.altitude - a.altitude;
  if (!shouldUseAltitudeDelta(horizontalDistance, verticalDelta)) {
    return horizontalDistance;
  }

  return Math.hypot(horizontalDistance, verticalDelta);
};

/** 좌표 경로 전체의 2D 수평 거리를 미터 단위로 계산한다. */
export const calculateTotalDistanceMeters = (path: LatLng[]): number => {
  if (path.length < 2) return 0;

  let total = 0;
  for (let i = 1; i < path.length; i += 1) {
    total += getDistanceMeters(path[i - 1], path[i]);
  }
  return total;
};

/** 좌표 경로 전체의 경사거리(3D path length)를 미터 단위로 계산한다. */
export const calculateTotalSlopeDistanceMeters = (
  path: AltitudePoint[]
): number => {
  if (path.length < 2) return 0;

  let total = 0;
  for (let i = 1; i < path.length; i += 1) {
    total += getSlopeDistanceMeters(path[i - 1], path[i]);
  }
  return total;
};
