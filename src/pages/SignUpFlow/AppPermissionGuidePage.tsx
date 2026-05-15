import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  Pressable,
  PermissionsAndroid,
  Platform,
  Alert,
} from 'react-native';
import { styles } from '@styles/AppPermissionGuidePage.styles';
import { initialize, requestPermission } from 'react-native-health-connect';
import {
  HEALTH_STEP_READ_PERMISSIONS,
  HEALTH_STEP_WRITE_PERMISSIONS,
  ensureHealthConnectInstalledOrPrompt,
  getCurrentGrantedPermissions,
  hasAllPermissions,
} from '@utils/healthConnect';
import { getAndroidApiLevel } from '@utils/stepSyncPolicy';
import { Colors } from '@styles/theme';

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

const requestHealthConnectPermissions = async (): Promise<boolean> => {
  try {
    const apiLevel = getAndroidApiLevel() ?? 0;
    if (__DEV__) console.log('[HC][Permission] apiLevel:', apiLevel);

    await ensureHealthConnectInstalledOrPrompt(apiLevel);
    if (__DEV__) console.log('[HC][Permission] ensureInstalled 통과');

    const isInitialized = await initialize();
    if (__DEV__) console.log('[HC][Permission] initialize():', isInitialized);
    if (!isInitialized) return false;

    // 이미 허용된 권한 먼저 확인 (useHealthSteps 패턴)
    const alreadyGranted = await getCurrentGrantedPermissions();
    if (__DEV__)
      console.log('[HC][Permission] 기존 허용 권한 수:', alreadyGranted.length);

    const foregroundPermissions = [
      ...HEALTH_STEP_READ_PERMISSIONS,
      ...HEALTH_STEP_WRITE_PERMISSIONS,
    ];

    if (hasAllPermissions(alreadyGranted, foregroundPermissions)) {
      if (__DEV__) console.log('[HC][Permission] 이미 권한 보유 → 요청 스킵');
      return true;
    }

    // foreground 권한만 요청 (background는 별도 — useHealthSteps 방식)
    if (__DEV__)
      console.log('[HC][Permission] requestPermission 호출 (foreground only)');
    const granted = await requestPermission(foregroundPermissions);
    if (__DEV__) {
      console.log('[HC][Permission] requestPermission 완료');
      console.log('[HC][Permission] 허용된 권한 목록 ─────────────────');
      if (granted.length === 0) {
        console.log('[HC][Permission] 허용된 권한 없음 (사용자가 거부)');
      } else {
        granted.forEach((p) =>
          console.log(`[HC][Permission]   ${p.accessType}:${p.recordType}`)
        );
      }
      console.log('─────────────────────────────────────────────────');
    }

    return hasAllPermissions(granted, HEALTH_STEP_READ_PERMISSIONS);
  } catch (e) {
    if (__DEV__) console.error('[HC][Permission] 오류:', e);
    return false;
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
  const deniedCountRef = useRef(0);

  const sdkVersion = Number(Platform.Version);

  const handleNext = async () => {
    await logGrantedPermissions(sdkVersion, pushAgree);
    onNext();
  };

  const handleAllowRequired = async () => {
    setRequestingRequired(true);
    const hasSteps = await requestHealthConnectPermissions();
    setRequiredGranted(hasSteps);
    setRequestingRequired(false);

    if (!hasSteps) {
      deniedCountRef.current += 1;
      if (deniedCountRef.current === 1) {
        Alert.alert(
          '권한이 거부되었습니다',
          '걸음 수 동기화를 위해 Health Connect 권한이 필요합니다. 다시 시도해주세요.',
          [{ text: '확인' }]
        );
      } else {
        Alert.alert(
          '권한을 직접 허용해주세요',
          'Health Connect 앱 → 앱 권한 → SlimPet에서 걸음 수 권한을 직접 허용한 뒤 버튼을 다시 눌러주세요.',
          [{ text: '확인' }]
        );
      }
    }
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
        <Text style={{ color: 'red' }}>필수</Text> 권한은 반드시 허용해 주세요.
        {'\n'} <Text style={{ color: Colors.info }}>선택</Text> 권한은 허용하지
        않아도 가입할 수 있어요.
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
          style={[
            styles.requiredButton,
            requiredGranted && styles.attemptedButton,
          ]}
          onPress={handleAllowRequired}
          disabled={requestingRequired || requestingOptional}
        >
          <View style={styles.buttonInner}>
            {requiredGranted && !requestingRequired && (
              <Text style={styles.checkIcon}>✔</Text>
            )}
            <Text style={styles.requiredButtonText}>
              {requestingRequired
                ? '처리 중...'
                : requiredGranted
                ? '필수 권한 허용됨'
                : '필수 권한 허용하기'}
            </Text>
          </View>
        </Pressable>
        <Pressable
          style={[
            styles.optionalButton,
            optionalAttempted && styles.attemptedOutlineButton,
          ]}
          onPress={handleAllowOptional}
          disabled={requestingRequired || requestingOptional}
        >
          <View style={styles.buttonInner}>
            {optionalAttempted && !requestingOptional && canRequestOptional && (
              <Text style={styles.checkIconOptional}>✔</Text>
            )}
            <Text style={styles.optionalButtonText}>
              {!canRequestOptional
                ? '해당 없음'
                : requestingOptional
                ? '처리 중...'
                : optionalAttempted
                ? '선택 권한 허용됨'
                : '선택 권한 허용하기'}
            </Text>
          </View>
        </Pressable>
        <Pressable
          style={[
            styles.nextButton,
            !requiredGranted && styles.nextButtonDisabled,
          ]}
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
    {required ? (
      <View style={styles.requiredBadge}>
        <Text style={styles.requiredBadgeText}>필수</Text>
      </View>
    ) : (
      <View style={styles.optionalBadge}>
        <Text style={styles.optionalBadgeText}>선택</Text>
      </View>
    )}
    <Text style={styles.permissionIcon}>{item.icon}</Text>
    <View style={styles.permissionText}>
      <View style={styles.permissionTitleRow}>
        <Text style={styles.permissionTitle}>{item.title}</Text>
      </View>
      <Text style={styles.permissionDescription}>{item.description}</Text>
    </View>
  </View>
);

export default AppPermissionGuidePage;
