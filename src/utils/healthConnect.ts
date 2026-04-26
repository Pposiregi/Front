import { Alert, Linking, Platform } from 'react-native';
import {
  getGrantedPermissions,
  getSdkStatus,
  type BackgroundAccessPermission,
  type Permission,
  type ReadHealthDataHistoryPermission,
  type WriteExerciseRoutePermission,
  SdkAvailabilityStatus,
} from 'react-native-health-connect';

// 걸음 수 조회에 필요한 최소 권한 세트
export const HEALTH_STEP_READ_PERMISSIONS: Permission[] = [
  { accessType: 'read', recordType: 'Steps' },
];

// 걸음 수 기록에 필요한 최소 권한 세트
export const HEALTH_STEP_WRITE_PERMISSIONS: Permission[] = [
  { accessType: 'write', recordType: 'Steps' },
];

// 백그라운드 동기화에 필요한 특수 권한은 별도로 관리한다.
export const HEALTH_BACKGROUND_PERMISSION: BackgroundAccessPermission = {
  accessType: 'read',
  recordType: 'BackgroundAccessPermission',
};

export const HEALTH_CONNECT_PROVIDER_PACKAGE = 'com.google.android.apps.healthdata';
export const HEALTH_CONNECT_INSTALL_URL = `https://play.google.com/store/apps/details?id=${HEALTH_CONNECT_PROVIDER_PACKAGE}`;
const GRANTED_PERMISSIONS_CACHE_TTL_MS = 60 * 1000;

type HealthConnectSdkState =
  | 'available'
  | 'unavailable'
  | 'provider_update_required';

let grantedPermissionsCache: GrantedHealthPermission[] | null = null;
let grantedPermissionsFetchedAt = 0;
let grantedPermissionsPromise: Promise<GrantedHealthPermission[]> | null = null;

/** Health Connect SDK 상태 코드를 내부 상태 문자열로 변환한다. */
const statusToState = (status: number): HealthConnectSdkState => {
  if (status === SdkAvailabilityStatus.SDK_AVAILABLE) {
    return 'available';
  }
  if (status === SdkAvailabilityStatus.SDK_UNAVAILABLE_PROVIDER_UPDATE_REQUIRED) {
    return 'provider_update_required';
  }
  return 'unavailable';
};

/** Health Connect 설치/업데이트 페이지를 연다. */
const openPlayStore = async () => {
  const marketUrl = `market://details?id=${HEALTH_CONNECT_PROVIDER_PACKAGE}`;
  const canOpenMarket = await Linking.canOpenURL(marketUrl);
  if (canOpenMarket) {
    await Linking.openURL(marketUrl);
    return;
  }
  await Linking.openURL(HEALTH_CONNECT_INSTALL_URL);
};

/** Health Connect 설치 및 업데이트 필요 여부를 확인하고 필요 시 안내한다. */
export const ensureHealthConnectInstalledOrPrompt = async (
  apiLevel: number,
  options?: { showPrompt?: boolean }
) => {
  const shouldPrompt = options?.showPrompt ?? true;
  // exported helper 자체에서 플랫폼을 확실히 좁혀 두어
  // 호출부가 실수하더라도 iOS/unsupported 기기에서 조용히 빠진다.
  if (Platform.OS !== 'android' || apiLevel < 28) return;

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

  if (shouldPrompt) {
    Alert.alert(
      'Health Connect 연동',
      'Health Connect가 설치되어 있지 않습니다. 설치 후 걸음수 연동을 진행할 수 있습니다.',
      [
        {
          text: 'Health Connect 설치',
          onPress: openPlayStore,
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

/** 현재 허용된 권한 집합이 필요한 권한 집합을 모두 포함하는지 검사한다. */
export const hasAllPermissions = (
  granted: GrantedHealthPermission[],
  requiredPermissions: GrantedHealthPermission[]
): boolean => {
  return requiredPermissions.every((required) =>
    granted.some(
      (permission) =>
        permission.recordType === required.recordType &&
        permission.accessType === required.accessType
    )
  );
};

/** 현재 허용된 Health Connect 권한 목록을 가져온다. */
export const getCurrentGrantedPermissions = async (
  options?: { forceRefresh?: boolean }
) => {
  const forceRefresh = options?.forceRefresh ?? false;
  const now = Date.now();

  if (
    !forceRefresh &&
    grantedPermissionsCache &&
    now - grantedPermissionsFetchedAt < GRANTED_PERMISSIONS_CACHE_TTL_MS
  ) {
    return grantedPermissionsCache;
  }

  if (!forceRefresh && grantedPermissionsPromise) {
    return grantedPermissionsPromise;
  }

  grantedPermissionsPromise = (async () => {
    try {
      const granted = (await getGrantedPermissions()) as GrantedHealthPermission[];
      grantedPermissionsCache = granted;
      grantedPermissionsFetchedAt = Date.now();
      return granted;
    } catch (err: any) {
      const message = String(err?.message ?? err ?? '');
      const isRateLimited =
        message.includes('Rate limited') || message.includes('quota');

      if (isRateLimited) {
        console.warn('[RUNNING][HC] getGrantedPermissions rate limited');
        if (grantedPermissionsCache) {
          return grantedPermissionsCache;
        }
        return [];
      }

      throw err;
    } finally {
      grantedPermissionsPromise = null;
    }
  })();

  return grantedPermissionsPromise;
};

/** 백그라운드 접근 특수 권한 보유 여부를 반환한다. */
export const hasBackgroundPermission = (
  granted: GrantedHealthPermission[]
): boolean =>
  hasAllPermissions(granted, [HEALTH_BACKGROUND_PERMISSION]);

/** KST 기준 오늘 00:00부터 현재 시각까지의 구간을 계산한다. */
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

/** 현재 플랫폼이 Android인지 반환한다. */
export const isAndroid = () => Platform.OS === 'android';

// 오늘 걸음 수 캐시 저장/조회 시 사용하는 키
export const HEALTH_STEPS_CACHE_KEY = 'fitpet:health:steps:today';
