import { RouteProp } from '@react-navigation/native';

// 타입 정의
export type ActivityStackParamList = {
  ActivityDetailPage: { sessionId: string };
};
export type ActivityDetailRouteProp = RouteProp<
  ActivityStackParamList,
  'ActivityDetailPage'
>;

export type GPS_LOG = {
  latitude: number;
  longitude: number;
  altitude: number;
};

export type SessionDetail = {
  startTime: string;
  endTime: string | null;
  totalDistance: number | null;
  // backend 표준은 m/s이며, 과거 필드명(avgSpeedKmh)도 호환 처리한다.
  avgSpeedMps?: number | null;
  avgSpeedKmh: number | null;
  stepCount: number | null;
  burnCalories: number | null;
  routeLogs: GPS_LOG[];
};
