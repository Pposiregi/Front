import { ActivityStackParamList } from '@navigation/activityStack';
import { NavigationProp } from '@react-navigation/native';

// 타입 지정
export type GPS_SESSION = {
  session_id: string;
  start_time: string;
  end_time: string;
  total_distance: number;
};

export type MissionData = {
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
