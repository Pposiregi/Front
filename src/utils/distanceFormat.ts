const DISTANCE_THRESHOLD_M = 1000;

type DistanceLabel = {
  value: string;
  unit: 'm' | 'km';
};

export const formatDistanceFromMeters = (meters: number): DistanceLabel => {
  // API 이상치(null/NaN/음수) 대응: 표시는 항상 0 이상으로 정규화한다.
  const safeMeters = Number.isFinite(meters) && meters > 0 ? meters : 0;
  // 1000m 이상부터 km 표기로 전환한다.
  if (safeMeters >= DISTANCE_THRESHOLD_M) {
    return {
      value: (safeMeters / DISTANCE_THRESHOLD_M).toFixed(2),
      unit: 'km',
    };
  }
  return {
    value: safeMeters.toFixed(2),
    unit: 'm',
  };
};

export const formatDistanceFromKm = (km: number): DistanceLabel => {
  // 일별 API는 km 단위이므로 1km 미만은 m로 환산해 가독성을 높인다.
  const safeKm = Number.isFinite(km) && km > 0 ? km : 0;
  if (safeKm >= 1) {
    return {
      value: safeKm.toFixed(2),
      unit: 'km',
    };
  }
  return {
    value: (safeKm * DISTANCE_THRESHOLD_M).toFixed(2),
    unit: 'm',
  };
};
