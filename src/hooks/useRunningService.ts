import notifee, { AndroidImportance } from '@notifee/react-native';
import { Platform } from 'react-native';

const CHANNEL_ID = 'running-tracker';
const NOTI_ID = 'running-notif';
const SMALL_ICON = 'ic_notification';

export async function startRunningNotification() {
  if (Platform.OS !== 'android') return;

  const createdChannelId = await notifee.createChannel({
    id: CHANNEL_ID,
    name: '러닝 트래킹',
    importance: AndroidImportance.DEFAULT,
  });

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

export async function updateRunningNotification(
  elapsedSec: number,
  steps: number
) {
  if (Platform.OS !== 'android') return;

  const createdChannelId = await notifee.createChannel({
    id: CHANNEL_ID,
    name: '러닝 트래킹',
    importance: AndroidImportance.DEFAULT,
  });

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

export async function stopRunningNotification() {
  if (Platform.OS !== 'android') return;
  await notifee.stopForegroundService();
}
