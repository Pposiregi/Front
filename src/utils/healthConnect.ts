import { Alert, Linking, Platform } from 'react-native';
import {
  getSdkStatus,
  type BackgroundAccessPermission,
  type Permission,
  type ReadHealthDataHistoryPermission,
  type WriteExerciseRoutePermission,
  SdkAvailabilityStatus,
  openHealthConnectSettings,
} from 'react-native-health-connect';

// 앱에서 사용하는 Health Connect 권한 세트
export const HEALTH_PERMISSIONS: (Permission | BackgroundAccessPermission)[] = [
  { accessType: 'read', recordType: 'Steps' },
  { accessType: 'write', recordType: 'Steps' },
  { accessType: 'read', recordType: 'BackgroundAccessPermission' },
];

export const HEALTH_CONNECT_PROVIDER_PACKAGE = 'com.google.android.apps.healthdata';
export const HEALTH_CONNECT_INSTALL_URL = `https://play.google.com/store/apps/details?id=${HEALTH_CONNECT_PROVIDER_PACKAGE}`;

type HealthConnectSdkState =
  | 'available'
  | 'unavailable'
  | 'provider_update_required';

const statusToState = (status: number): HealthConnectSdkState => {
  if (status === SdkAvailabilityStatus.SDK_AVAILABLE) {
    return 'available';
  }
  if (status === SdkAvailabilityStatus.SDK_UNAVAILABLE_PROVIDER_UPDATE_REQUIRED) {
    return 'provider_update_required';
  }
  return 'unavailable';
};

const openPlayStore = async () => {
  const marketUrl = `market://details?id=${HEALTH_CONNECT_PROVIDER_PACKAGE}`;
  const canOpenMarket = await Linking.canOpenURL(marketUrl);
  if (canOpenMarket) {
    await Linking.openURL(marketUrl);
    return;
  }
  await Linking.openURL(HEALTH_CONNECT_INSTALL_URL);
};

export const ensureHealthConnectInstalledOrPrompt = async (
  apiLevel: number,
  options?: { showPrompt?: boolean }
) => {
  const shouldPrompt = options?.showPrompt ?? true;
  if (!Platform.OS || apiLevel < 28) return;

  let state: HealthConnectSdkState = 'unavailable';
  try {
    const status = await getSdkStatus(HEALTH_CONNECT_PROVIDER_PACKAGE);
    state = statusToState(status);
  } catch (err) {
    console.warn('[RUNNING][HC] getSdkStatus 실패', err);
    state = 'unavailable';
  }

  if (state === 'available') return;

  if (state === 'provider_update_required') {
    if (shouldPrompt) {
      Alert.alert(
        'Health Connect 버전 업그레이드',
        'Health Connect 앱의 버전이 오래되어 걸음수 동기화가 비활성화됐습니다. 업데이트 후 다시 시도해 주세요.',
        [
          {
            text: '업데이트/설치',
            onPress: openPlayStore,
          },
        ]
      );
    }
    throw new Error('Health Connect 업데이트가 필요합니다.');
  }

  const canOpenSettings = Platform.OS === 'android';
  if (canOpenSettings && shouldPrompt) {
    Alert.alert(
      'Health Connect 연동',
      'Health Connect가 설치되어 있지 않습니다. 설치 후 걸음수 연동을 진행할 수 있습니다.',
      [
        {
          text: 'Health Connect 설치',
          onPress: openPlayStore,
        },
        {
          text: 'Health Connect 설정 열기',
          onPress: openHealthConnectSettings,
        },
      ]
    );
  }
  throw new Error('Health Connect가 설치되어 있지 않습니다.');
};

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
  // KST(UTC+9) 기준으로 오늘 00:00 ~ 현재 시각 구간을 만든다.
  const KST_OFFSET_MS = 9 * 60 * 60 * 1000;
  const now = new Date();
  const shifted = new Date(now.getTime() + KST_OFFSET_MS);

  const startShifted = new Date(
    Date.UTC(
      shifted.getUTCFullYear(),
      shifted.getUTCMonth(),
      shifted.getUTCDate(),
      0,
      0,
      0,
      0
    )
  );

  const start = new Date(startShifted.getTime() - KST_OFFSET_MS);
  return { start, end: now };
};

export const isAndroid = () => Platform.OS === 'android';

// 오늘 걸음 수 캐시 저장/조회 시 사용하는 키
export const HEALTH_STEPS_CACHE_KEY = 'fitpet:health:steps:today';
