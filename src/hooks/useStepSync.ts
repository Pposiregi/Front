import { postMissionsStep } from '@api/missionApi';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCallback } from 'react';

const STEP_UNIT = 1000;
const STORAGE_KEY = 'LAST_SYNCED_STEPS';

export const useStepSync = () => {
  const syncSteps = useCallback(async (currentSteps: number) => {
    try {
      // 마지막으로 서버에 반영한 걸음 수
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      const lastSyncedSteps = stored ? Number(stored) : 0;
      console.log('마지막으로 서버에 반영한 걸음 수', lastSyncedSteps);

      // 차이 계산
      const diff = currentSteps - lastSyncedSteps;

      // 아직 1000보 안 찼으면 패스
      if (diff < STEP_UNIT) return;

      // 몇 번 보낼지 (1000보 단위)
      const sendCount = Math.floor(diff / STEP_UNIT);
      const stepsToSend = sendCount * STEP_UNIT;

      // 서버 전송
      await postMissionsStep({
        increment: stepsToSend,
      });

      // 로컬에 반영
      await AsyncStorage.setItem(
        STORAGE_KEY,
        String(lastSyncedSteps + stepsToSend)
      );
    } catch (error) {
      console.error('[useStepSync] step sync failed', error);
    }
  }, []);

  return { syncSteps };
};
