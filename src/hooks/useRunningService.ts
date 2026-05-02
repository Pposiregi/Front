import notifee, {
  AndroidImportance,
  AuthorizationStatus,
} from '@notifee/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

const CHANNEL_ID = 'running-tracker';
const NOTI_ID = 'running-notif';
const SMALL_ICON = 'ic_notification';
const CHANNEL_NAME = '러닝 트래킹';
const NOTIFICATION_PERMISSION_REQUESTED_KEY =
  'runningNotificationPermissionRequested';
let runningChannelPromise: Promise<string> | null = null;
let canDisplayRunningNotificationCache: boolean | null = null;

/** 러닝 알림 채널을 1회만 생성하고 재사용한다. */
const ensureRunningChannel = () => {
  if (!runningChannelPromise) {
    // update hot path에서 JS->native createChannel 호출을 반복하지 않도록
    // 앱 수명 동안 1회만 channel 생성 Promise를 재사용한다.
    runningChannelPromise = notifee
      .createChannel({
        id: CHANNEL_ID,
        name: CHANNEL_NAME,
        importance: AndroidImportance.DEFAULT,
        vibration: false,
      })
      .catch((error) => {
        // rejected promise를 계속 들고 있으면 앱 재시작 전까지 모든 알림 갱신이 막히므로
        // 실패 시 캐시를 비워 다음 호출에서 다시 채널 생성을 시도한다.
        runningChannelPromise = null;
        throw error;
      });
  }
  return runningChannelPromise;
};

/**
 * Android 13+ 신규 설치에서 일부 Notifee 버전이 NOT_DETERMINED를 DENIED처럼
 * 돌려줄 수 있어, 러닝 시작 시에는 앱 내부 요청 이력을 기준으로 1회 권한 요청을 보장한다.
 */
const requestRunningNotificationPermissionIfNeeded = async () => {
  if (Platform.OS !== 'android') return false;

  try {
    const requested = await AsyncStorage.getItem(
      NOTIFICATION_PERMISSION_REQUESTED_KEY
    );

    if (requested !== 'true') {
      const settings = await notifee.requestPermission();
      await AsyncStorage.setItem(NOTIFICATION_PERMISSION_REQUESTED_KEY, 'true');
      canDisplayRunningNotificationCache =
        settings.authorizationStatus === AuthorizationStatus.AUTHORIZED;
      return canDisplayRunningNotificationCache;
    }

    const settings = await notifee.getNotificationSettings();
    canDisplayRunningNotificationCache =
      settings.authorizationStatus === AuthorizationStatus.AUTHORIZED;
    return canDisplayRunningNotificationCache;
  } catch (error) {
    console.warn('[RUNNING][NOTIFICATION] 권한 요청 실패', error);
    canDisplayRunningNotificationCache = false;
    return false;
  }
};

const displayRunningNotification = async (
  body: string,
  options?: { showChronometer?: boolean; timestamp?: number }
) => {
  if (!canDisplayRunningNotificationCache) return;

  const createdChannelId = await ensureRunningChannel();

  await notifee.displayNotification({
    id: NOTI_ID,
    title: '🏃 러닝 기록 중',
    body,
    android: {
      channelId: createdChannelId,
      asForegroundService: true,
      ongoing: true,
      smallIcon: SMALL_ICON,
      onlyAlertOnce: true,
      pressAction: { id: 'default' },
      showChronometer: options?.showChronometer ?? false,
      ...(options?.timestamp ? { timestamp: options.timestamp } : {}),
    },
  });
};

/** 러닝 시작용 foreground notification을 표시한다. */
export async function startRunningNotification() {
  if (Platform.OS !== 'android') return;

  try {
    if (!(await requestRunningNotificationPermissionIfNeeded())) return;

    await displayRunningNotification('운동 시간을 측정하고 있습니다.', {
      showChronometer: true,
      timestamp: Date.now(),
    });
  } catch (error) {
    console.warn('[RUNNING][NOTIFICATION] 시작 알림 표시 실패', error);
  }
}

/** 진행 중인 러닝 알림의 시간/걸음 수 텍스트를 갱신한다. */
export async function updateRunningNotification(
  elapsedSec: number,
  steps: number
) {
  if (Platform.OS !== 'android') return;

  try {
    await displayRunningNotification(
      `${elapsedSec}초 · ${steps.toLocaleString()}보`
    );
  } catch (error) {
    console.warn('[RUNNING][NOTIFICATION] 진행 알림 갱신 실패', error);
  }
}

/** 러닝 foreground service와 notification을 종료한다. */
export async function stopRunningNotification() {
  if (Platform.OS !== 'android') return;
  try {
    await notifee.stopForegroundService();
  } catch (error) {
    console.warn('[RUNNING][NOTIFICATION] foreground service 종료 실패', error);
  }
}
