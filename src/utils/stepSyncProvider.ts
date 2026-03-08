import {
  getAndroidApiLevel,
  STEP_SYNC_OS_POLICY,
  STEP_SYNC_MESSAGES,
} from '@utils/stepSyncPolicy';

export type StepSyncProviderKind =
  | 'unsupported'
  | 'health_connect';

export const getPreferredStepSyncProvider = (): StepSyncProviderKind => {
  const apiLevel = getAndroidApiLevel();
  if (apiLevel == null) return 'unsupported';

  if (apiLevel <= STEP_SYNC_OS_POLICY.unsupportedMaxApi) {
    return 'unsupported';
  }
  if (apiLevel >= STEP_SYNC_OS_POLICY.healthConnectMinApi) {
    return 'health_connect';
  }

  // 정책상 분기에서 제외된 API는 미지원으로 취급한다.
  return 'unsupported';
};

export const getStepSyncUnsupportedReason = (
  provider: StepSyncProviderKind
) => {
  if (provider === 'unsupported') {
    return STEP_SYNC_MESSAGES.unsupported;
  }
  return null;
};
