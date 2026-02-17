import type { LatLng } from '@shared/types/location';

/**
 * 두 좌표 간 거리를 하버사인 공식으로 계산 (미터)
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
