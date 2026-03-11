import notifee, { AndroidImportance } from '@notifee/react-native';
import { Platform } from 'react-native';

const CHANNEL_ID = 'running-tracker';
const NOTI_ID = 'running-notif';
const SMALL_ICON = 'ic_notification';
let runningChannelPromise: Promise<string> | null = null;

/** 러닝 알림 채널을 1회만 생성하고 재사용한다. */
const ensureRunningChannel = () => {
  if (!runningChannelPromise) {
    // update hot path에서 JS->native createChannel 호출을 반복하지 않도록
    // 앱 수명 동안 1회만 channel 생성 Promise를 재사용한다.
    runningChannelPromise = notifee.createChannel({
      id: CHANNEL_ID,
      name: '러닝 트래킹',
      importance: AndroidImportance.DEFAULT,
    });
  }
  return runningChannelPromise;
};

/** 러닝 시작용 foreground notification을 표시한다. */
export async function startRunningNotification() {
  if (Platform.OS !== 'android') return;

  const createdChannelId = await ensureRunningChannel();

  await notifee.displayNotification({
    id: NOTI_ID,
    title: '🏃 러닝 기록 중',
    body: '운동 시간을 측정하고 있습니다.',
    android: {
      channelId: createdChannelId,
      asForegroundService: true,
      ongoing: true,
      smallIcon: SMALL_ICON,
      pressAction: { id: 'default' },
      showChronometer: true,
      timestamp: Date.now(),
    },
  });
}

/** 진행 중인 러닝 알림의 시간/걸음 수 텍스트를 갱신한다. */
export async function updateRunningNotification(
  elapsedSec: number,
  steps: number
) {
  if (Platform.OS !== 'android') return;

  const createdChannelId = await ensureRunningChannel();

  await notifee.displayNotification({
    id: NOTI_ID, // 🔥 같은 id
    title: '🏃 러닝 기록 중',
    body: `${elapsedSec}초 · ${steps.toLocaleString()}보`,
    android: {
      channelId: createdChannelId,
      asForegroundService: true,
      ongoing: true,
      smallIcon: SMALL_ICON,
      onlyAlertOnce: true, // 🔥 진동 반복 방지 (중요)
      pressAction: { id: 'default' },
    },
  });
}

/** 러닝 foreground service와 notification을 종료한다. */
export async function stopRunningNotification() {
  if (Platform.OS !== 'android') return;
  await notifee.stopForegroundService();
}
