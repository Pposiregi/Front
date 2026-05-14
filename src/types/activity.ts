import { ActivityStackParamList } from '@navigation/activityStack';
import { NavigationProp } from '@react-navigation/native';

/**
 * GPS 세션 요약 정보.
 */
export type GPS_SESSION = {
  sessionId: number;
  startTime: string;
  endTime: string | null;
  totalDistance: number | null;
};

/**
 * 주간 걸음수 항목.
 */
export type WeeklyStepItem = {
  date: string;
  step: number;
};

/**
 * 일일 활동 요약.
 */
export type DailyActivity = {
  date: string;
  steps: number;
  distanceKm: number;
  burnCalories: number;
  runningSeconds?: number;
};

/**
 * Activity 상세 화면 네비게이션 타입.
 */
export type ActivityDetailNavigationProp = NavigationProp<
  ActivityStackParamList,
  'ActivityDetailPage'
>;

/**
 * 차트 데이터 타입.
 */
export type ChartData = {
  labels: string[];
  // strokeWidth: 차트 내의 선 두께
  datasets: {
    data: number[];
    strokeWidth?: number;
    colors?: Array<(opacity: number) => string>;
  }[];
};
