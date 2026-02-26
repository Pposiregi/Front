import { useEffect, useCallback } from 'react';
import { AppState, Platform } from 'react-native';
import notifee, { AndroidImportance } from '@notifee/react-native';

export const useRunningService = (isTracking: boolean, elapsedSec: number) => {
  const updateService = useCallback(async (seconds: number) => {
    if (Platform.OS !== 'android') return;

    try {
      const channelId = await notifee.createChannel({
        id: 'running-tracker',
        name: '러닝 트래킹',
        importance: AndroidImportance.HIGH,
      });

      await notifee.displayNotification({
        id: 'running-notif',
        title: '🏃 열심히 달리는 중!',
        body: `현재 기록: ${formatRunningElapsed(seconds)}`,
        android: {
          channelId,
          asForegroundService: true, // 서비스 등록과 쌍을 이룹니다.
          ongoing: true,
          pressAction: { id: 'default' },
          // 아이콘이 없으면 알림이 안 뜰 수 있으니 기본 아이콘 설정
          smallIcon: 'ic_launcher',
        },
      });
    } catch (err) {
      console.error('Notification Update Error:', err);
    }
  }, []);

  useEffect(() => {
    if (!isTracking) {
      if (Platform.OS === 'android') {
        notifee.stopForegroundService();
        notifee.cancelNotification('running-notif');
      }
      return;
    }

    // 1초마다 변하는 elapsedSec에 맞춰 알림 갱신
    updateService(elapsedSec);
  }, [isTracking, elapsedSec, updateService]);
};

// 시간 포맷 함수 (훅 내부에서 쓰기 위해 복사하거나 import)
const formatRunningElapsed = (seconds: number) => {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(
    s
  ).padStart(2, '0')}`;
};
