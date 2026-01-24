import { ActivityStackParamList } from '@navigation/activityStack';
import { NavigationProp } from '@react-navigation/native';

// 타입 지정
export type GPS_SESSION = {
  sessionId: number;
  startTime: string;
  endTime: string;
  totalDistance: number;
};

export type WeeklyStepItem = {
  date: string;
  step: number;
};

export type DailyActivity = {
  date: string;
  steps: number;
  distanceKm: number;
  burnCalories: number;
};

export type ActivityDetailNavigationProp = NavigationProp<
  ActivityStackParamList,
  'ActivityDetailPage'
>;

export type ChartData = {
  labels: string[];
  // strokeWidth: 차트 내의 선 두께
  datasets: { data: number[]; strokeWidth?: number }[];
};
