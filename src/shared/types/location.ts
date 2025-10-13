// 앱 전역에서 재사용하는 위/경도 및 지도 영역 타입 정의
export type LatLng = {
  latitude: number;
  longitude: number;
};

export type MapRegion = LatLng & {
  latitudeDelta: number;
  longitudeDelta: number;
};
