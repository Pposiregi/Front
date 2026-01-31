import { ActivityStackParamList } from '@navigation/activityStack';
import { NavigationProp } from '@react-navigation/native';

// 타입 지정
export type GPS_SESSION = {
  sessionId: string;
  startTime: string;
  endTime: string;
  totalDistance: number;
};

export type WeeklyStepItem = {
  date: string;
  step: number;
};

export type ActivityDetailNavigationProp = NavigationProp<
  ActivityStackParamList,
  'ActivityDetailPage'
>;

export type ChartData = {
  labels: string[];
  datasets: { data: number[] }[];
};
