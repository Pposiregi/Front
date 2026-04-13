import React, { useState } from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Dimensions,
  PermissionsAndroid,
  Platform,
} from 'react-native';
import { initialize, requestPermission } from 'react-native-health-connect';
import {
  HEALTH_STEP_READ_PERMISSIONS,
  HEALTH_STEP_WRITE_PERMISSIONS,
  HEALTH_BACKGROUND_PERMISSION,
  ensureHealthConnectInstalledOrPrompt,
  getCurrentGrantedPermissions,
} from '@utils/healthConnect';
import { getAndroidApiLevel } from '@utils/stepSyncPolicy';

type Props = {
  onNext: () => void;
  pushAgree: boolean;
};

type PermissionItem = {
  icon: string;
  title: string;
  description: string;
};

const REQUIRED_ITEMS: PermissionItem[] = [
  {
    icon: '🏃',
    title: '신체 활동 (Health Connect)',
    description:
      '걸음 수 측정 및 동기화에 사용됩니다.\nHealth Connect 앱이 필요해요.',
  },
];

const OPTIONAL_ITEMS: PermissionItem[] = [
  {
    icon: '🔔',
    title: '알림',
    description: '운동 목표 달성 및 주요 알림을 받을 수 있어요.',
  },
];

const requestHealthConnectPermissions = async () => {
  try {
    const apiLevel = getAndroidApiLevel() ?? 0;
    if (__DEV__) console.log('[HC][Permission] apiLevel:', apiLevel);

    await ensureHealthConnectInstalledOrPrompt(apiLevel);
    if (__DEV__) console.log('[HC][Permission] ensureInstalled 통과');

    const isInitialized = await initialize();
    if (__DEV__) console.log('[HC][Permission] initialize():', isInitialized);
    if (!isInitialized) return;

    if (__DEV__) console.log('[HC][Permission] requestPermission 호출');
    await requestPermission([
      ...HEALTH_STEP_READ_PERMISSIONS,
      ...HEALTH_STEP_WRITE_PERMISSIONS,
      HEALTH_BACKGROUND_PERMISSION,
    ]);
    if (__DEV__) console.log('[HC][Permission] requestPermission 완료');
  } catch (e) {
    if (__DEV__) console.error('[HC][Permission] 오류:', e);
  }
};

const requestOptionalPermissions = async (pushAgree: boolean) => {
  if (Platform.OS !== 'android') return;

  const sdkVersion = Number(Platform.Version);

  if (!pushAgree || sdkVersion < 33) return;

  await PermissionsAndroid.request(
    PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
  );
};

const logGrantedPermissions = async (
  sdkVersion: number,
  pushAgree: boolean
) => {
  if (!__DEV__) return;

  // Android 권한 체크
  const androidPermissions: Record<string, string> = {
    ...(pushAgree && sdkVersion >= 33
      ? { 알림: PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS }
      : {}),
  };

  const androidResults: Record<string, boolean> = {};
  for (const [label, permission] of Object.entries(androidPermissions)) {
    androidResults[label] = await PermissionsAndroid.check(
      permission as Parameters<typeof PermissionsAndroid.check>[0]
    );
  }

  // Health Connect 권한 체크
  let healthResults: string[] = [];
  try {
    const granted = await getCurrentGrantedPermissions();
    healthResults = granted.map((p) => `${p.accessType}:${p.recordType}`);
  } catch {
    healthResults = ['확인 실패'];
  }

  console.log('[Permission][다음 페이지 이동] 권한 현황 ─────────────────');
  console.log('[Permission] Android 권한:', androidResults);
  console.log('[Permission] Health Connect:', healthResults);
  console.log('──────────────────────────────────────────────────────────');
};

const AppPermissionGuidePage: React.FC<Props> = ({ onNext, pushAgree }) => {
  const [requestingRequired, setRequestingRequired] = useState(false);
  const [requestingOptional, setRequestingOptional] = useState(false);
  // 실제 권한 부여 여부 (클릭 여부가 아닌 실제 결과)
  const [requiredGranted, setRequiredGranted] = useState(false);
  const [optionalAttempted, setOptionalAttempted] = useState(false);

  const sdkVersion = Number(Platform.Version);

  const handleNext = async () => {
    await logGrantedPermissions(sdkVersion, pushAgree);
    onNext();
  };

  const handleAllowRequired = async () => {
    setRequestingRequired(true);
    await requestHealthConnectPermissions();
    // 요청 후 실제로 READ_STEPS 권한이 부여됐는지 확인
    try {
      const granted = await getCurrentGrantedPermissions();
      const hasSteps = granted.some(
        (p) => p.recordType === 'Steps' && p.accessType === 'read'
      );
      setRequiredGranted(hasSteps);
    } catch {
      setRequiredGranted(false);
    }
    setRequestingRequired(false);
  };

  const canRequestOptional = pushAgree && sdkVersion >= 33;

  const handleAllowOptional = async () => {
    if (!canRequestOptional) return;
    setRequestingOptional(true);
    await requestOptionalPermissions(pushAgree);
    setRequestingOptional(false);
    setOptionalAttempted(true);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>앱 사용을 위한 권한 안내</Text>
      <Text style={styles.subtitle}>
        허용하지 않아도 가입은 가능하지만{'\n'}일부 기능이 제한될 수 있어요.
      </Text>

      <View style={styles.list}>
        <Text style={styles.sectionLabel}>필수 권한</Text>
        {REQUIRED_ITEMS.map((item) => (
          <PermissionRow key={item.title} item={item} required />
        ))}

        <Text style={styles.sectionLabel}>선택 권한</Text>
        {OPTIONAL_ITEMS.map((item) => (
          <PermissionRow key={item.title} item={item} />
        ))}
      </View>

      <View style={styles.buttonContainer}>
        <Pressable
          style={[styles.requiredButton, requiredGranted && styles.attemptedButton]}
          onPress={handleAllowRequired}
          disabled={requestingRequired || requestingOptional}
        >
          <Text style={styles.requiredButtonText}>
            {requestingRequired
              ? '처리 중...'
              : requiredGranted
              ? '✓ 필수 권한 허용됨'
              : '필수 권한 허용하기'}
          </Text>
        </Pressable>
        <Pressable
          style={[styles.optionalButton, optionalAttempted && styles.attemptedOutlineButton]}
          onPress={handleAllowOptional}
          disabled={requestingRequired || requestingOptional}
        >
          <Text style={styles.optionalButtonText}>
            {!canRequestOptional
              ? '해당 없음'
              : requestingOptional
              ? '처리 중...'
              : optionalAttempted
              ? '✓ 선택 권한 시도됨'
              : '선택 권한 허용하기'}
          </Text>
        </Pressable>
        <Pressable
          style={[styles.nextButton, !requiredGranted && styles.nextButtonDisabled]}
          onPress={handleNext}
          disabled={!requiredGranted}
        >
          <Text style={styles.nextButtonText}>다음으로</Text>
        </Pressable>
      </View>
    </View>
  );
};

type PermissionRowProps = {
  item: PermissionItem;
  required?: boolean;
};

const PermissionRow: React.FC<PermissionRowProps> = ({ item, required }) => (
  <View style={styles.permissionItem}>
    <Text style={styles.permissionIcon}>{item.icon}</Text>
    <View style={styles.permissionText}>
      <View style={styles.permissionTitleRow}>
        <Text style={styles.permissionTitle}>{item.title}</Text>
        {required && (
          <View style={styles.requiredBadge}>
            <Text style={styles.requiredBadgeText}>필수</Text>
          </View>
        )}
      </View>
      <Text style={styles.permissionDescription}>{item.description}</Text>
    </View>
  </View>
);

export default AppPermissionGuidePage;

const { height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: height * 0.04,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    textAlign: 'center',
    fontFamily: 'JUA',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    textAlign: 'center',
    color: '#666',
    lineHeight: 22,
    marginBottom: 20,
    fontFamily: 'Roboto-VariableFont',
  },
  list: {
    flex: 1,
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#999',
    marginBottom: 8,
    marginTop: 4,
    fontFamily: 'Roboto-VariableFont',
  },
  permissionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
  },
  permissionIcon: {
    fontSize: 28,
    marginRight: 14,
  },
  permissionText: {
    flex: 1,
  },
  permissionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  permissionTitle: {
    fontSize: 15,
    fontWeight: '700',
    fontFamily: 'JUA',
  },
  requiredBadge: {
    backgroundColor: '#FF6347',
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  requiredBadgeText: {
    color: '#fff',
    fontSize: 11,
    fontFamily: 'Roboto-VariableFont',
  },
  permissionDescription: {
    fontSize: 12,
    color: '#666',
    fontFamily: 'Roboto-VariableFont',
    lineHeight: 18,
  },
  buttonContainer: {
    paddingTop: 12,
    paddingBottom: 16,
    gap: 8,
  },
  requiredButton: {
    backgroundColor: '#FF6347',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  requiredButtonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'JUA',
  },
  optionalButton: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FF6347',
  },
  optionalButtonText: {
    color: '#FF6347',
    fontSize: 16,
    fontFamily: 'JUA',
  },
  attemptedButton: {
    backgroundColor: '#4CAF50',
  },
  attemptedOutlineButton: {
    borderColor: '#4CAF50',
  },
  nextButton: {
    backgroundColor: '#FF6347',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 4,
  },
  nextButtonDisabled: {
    backgroundColor: '#ccc',
  },
  nextButtonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'JUA',
  },
});
