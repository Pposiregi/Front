import { Platform } from 'react-native';

export const STEP_SYNC_OS_POLICY = {
  unsupportedMaxApi: 27, // Android 8 이하 미지원
  healthConnectMinApi: 28, // Android 28~33은 설치 권장, 34+는 내장 Health Connect 경유
} as const;

export const STEP_SYNC_UPLOAD_POLICY = {
  mode: 'incremental',
  minStepDelta: 1,
} as const;

export const STEP_SYNC_MESSAGES = {
  unsupported:
    '현재 Android 8 이하에서는 걸음수 자동 동기화를 지원하지 않습니다.',
  permissionRequired:
    '걸음수 동기화를 위해 건강 데이터 접근 권한이 필요해요.',
} as const;

export const getAndroidApiLevel = (): number | null => {
  if (Platform.OS !== 'android') return null;
  const raw = Platform.Version;
  const api = typeof raw === 'string' ? Number(raw) : raw;
  return Number.isFinite(api) ? Number(api) : null;
};

export const isStepSyncUnsupportedByPolicy = (): boolean => {
  const api = getAndroidApiLevel();
  if (api == null) return false;
  return api <= STEP_SYNC_OS_POLICY.unsupportedMaxApi;
};
