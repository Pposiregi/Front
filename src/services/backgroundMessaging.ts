import AsyncStorage from '@react-native-async-storage/async-storage';
import messaging, {
  FirebaseMessagingTypes,
} from '@react-native-firebase/messaging';
import {
  initialize,
  readRecords,
  requestPermission,
} from 'react-native-health-connect';
import {
  getStartOfToday,
  hasAllPermissions,
  HEALTH_PERMISSIONS,
  HEALTH_STEPS_CACHE_KEY,
  type GrantedHealthPermission,
  isAndroid,
} from '@utils/healthConnect';

const logPrefix = '[FCM][background]';

const syncStepsForToday = async () => {
  // Health Connect 권한을 확인하고 오늘 걸음 수를 읽어 로컬 캐시에 저장
  if (!isAndroid()) {
    console.log(`${logPrefix} skip sync: 안드로이드가 아닙니다. `);
    return;
  }

  const isInitialized = await initialize();
  if (!isInitialized) {
    throw new Error('Health Connect 초기화 실패');
  }

  // 필수 권한 승인 여부 확인
  const granted: GrantedHealthPermission[] = await requestPermission(
    HEALTH_PERMISSIONS
  );
  if (!hasAllPermissions(granted)) {
    throw new Error('필수 권한 미승인');
  }

  const { start, end } = getStartOfToday();
  const result = await readRecords('Steps', {
    timeRangeFilter: {
      operator: 'between',
      startTime: start.toISOString(),
      endTime: end.toISOString(),
    },
  });
  const total = result.records.reduce(
    (sum: number, record: any) => sum + (record.count || 0),
    0
  );
  await AsyncStorage.setItem(
    HEALTH_STEPS_CACHE_KEY,
    JSON.stringify({ date: start.toISOString(), steps: total })
  );
  console.log(`${logPrefix} steps synced`, total);
};

const handleDataMessage = async (
  remoteMessage: FirebaseMessagingTypes.RemoteMessage
) => {
  // 백엔드가 내려주는 action/type에 따라 작업을 분기
  const action = remoteMessage.data?.action || remoteMessage.data?.type;
  if (!action) {
    console.warn(`${logPrefix} unknown message payload`, remoteMessage.data);
    return;
  }

  switch (action) {
    case 'sync_steps':
    case 'SYNC_STEPS': {
      await syncStepsForToday();
      return;
    }
    default:
      console.log(`${logPrefix} no handler for action`, action);
  }
};

export const registerBackgroundMessageHandler = () => {
  // 백그라운드에서 도착하는 데이터 메시지를 공용 핸들러에 위임
  messaging().setBackgroundMessageHandler(async (remoteMessage) => {
    try {
      await handleDataMessage(remoteMessage);
    } catch (err) {
      console.error(`${logPrefix} handler failed`, err);
    }
  });
};
