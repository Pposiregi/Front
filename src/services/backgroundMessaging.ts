import AsyncStorage from '@react-native-async-storage/async-storage';
import messaging, {
  FirebaseMessagingTypes,
} from '@react-native-firebase/messaging';
import {
  initialize,
  readRecords,
} from 'react-native-health-connect';
import {
  getStartOfToday,
  HEALTH_STEPS_CACHE_KEY,
  ensureHealthConnectInstalledOrPrompt,
  isAndroid,
} from '@utils/healthConnect';
import {
  getPreferredStepSyncProvider,
  getStepSyncUnsupportedReason,
} from '@utils/stepSyncProvider';
import { getAndroidApiLevel } from '@utils/stepSyncPolicy';

const logPrefix = '[FCM][background]';

const syncStepsForToday = async () => {
  // Health Connect 권한을 확인하고 오늘 걸음 수를 읽어 로컬 캐시에 저장
  if (!isAndroid()) {
    console.log(`${logPrefix} skip sync: 안드로이드가 아닙니다. `);
    return;
  }
  const provider = getPreferredStepSyncProvider();
  const unsupportedReason = getStepSyncUnsupportedReason(provider);
  if (unsupportedReason) {
    console.log(`${logPrefix} skip sync: ${unsupportedReason}`);
    return;
  }

  const apiLevel = getAndroidApiLevel();
  try {
    await ensureHealthConnectInstalledOrPrompt(apiLevel ?? 0, {
      showPrompt: false,
    });
  } catch (err) {
    console.log(`${logPrefix} skip sync: ${err}`);
    return;
  }

  const isInitialized = await initialize();
  if (!isInitialized) {
    throw new Error('Health Connect 초기화 실패');
  }

  // 백그라운드에서는 사용자 인터랙션 없이 읽기만 수행.
  // 권한은 포그라운드 `useHealthSteps`에서만 요청하고, 여기서는 미설치/가용성 실패만 선차단한다.

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
