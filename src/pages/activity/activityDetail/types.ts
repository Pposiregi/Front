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
  endTime: string;
  totalDistance: number;
  avgSpeedKmh: number;
  stepCount: number;
  burnCalories: number;
  routeLogs: GPS_LOG[];
};
