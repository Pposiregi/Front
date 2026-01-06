import { Platform } from 'react-native';
import {
  type BackgroundAccessPermission,
  type Permission,
  type ReadHealthDataHistoryPermission,
  type WriteExerciseRoutePermission,
} from 'react-native-health-connect';

// 앱에서 사용하는 Health Connect 권한 세트
export const HEALTH_PERMISSIONS: (Permission | BackgroundAccessPermission)[] = [
  { accessType: 'read', recordType: 'Steps' },
  { accessType: 'write', recordType: 'Steps' },
  { accessType: 'read', recordType: 'BackgroundAccessPermission' },
];

// requestPermission이 돌려줄 수 있는 모든 권한 타입 집합
export type GrantedHealthPermission =
  | Permission
  | BackgroundAccessPermission
  | WriteExerciseRoutePermission
  | ReadHealthDataHistoryPermission;

// 요청한 권한이 모두 허용됐는지 검사
export const hasAllPermissions = (
  granted: GrantedHealthPermission[]
): boolean => {
  return HEALTH_PERMISSIONS.every((required) =>
    granted.some(
      (permission) =>
        permission.recordType === required.recordType &&
        permission.accessType === required.accessType
    )
  );
};

// 금일 0시~현재 시각 구간 계산
export const getStartOfToday = () => {
  const now = new Date();
  const start = new Date(now);
  start.setHours(0, 0, 0, 0);
  return { start, end: now };
};

export const isAndroid = () => Platform.OS === 'android';

// 오늘 걸음 수 캐시 저장/조회 시 사용하는 키
export const HEALTH_STEPS_CACHE_KEY = 'fitpet:health:steps:today';
