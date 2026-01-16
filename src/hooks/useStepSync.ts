import { postMissionsStep } from '@api/missionApi';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCallback } from 'react';

const STEP_UNIT = 1000;
const STORAGE_KEY = 'LAST_SYNCED_STEPS';
const STORAGE_DATE_KEY = 'LAST_SYNCED_DATE';

export const useStepSync = () => {
  const syncSteps = useCallback(async (currentSteps: number) => {
    try {
      // 오늘 날짜 key
      const todayKey = new Date().toISOString().slice(0, 10);

      // 마지막 동기화 날짜 확인
      const storedDate = await AsyncStorage.getItem(STORAGE_DATE_KEY);
      let lastSyncedSteps = Number(
        (await AsyncStorage.getItem(STORAGE_KEY)) ?? 0
      );

      // 날짜가 바뀌면 초기화
      if (storedDate !== todayKey) {
        lastSyncedSteps = 0;
        await AsyncStorage.setItem(STORAGE_KEY, '0');
        await AsyncStorage.setItem(STORAGE_DATE_KEY, todayKey);
      }

      const diff = currentSteps - lastSyncedSteps;
      if (diff < STEP_UNIT) return;

      const sendCount = Math.floor(diff / STEP_UNIT);
      const stepsToSend = sendCount * STEP_UNIT;

      await postMissionsStep({ increment: stepsToSend });

      await AsyncStorage.setItem(
        STORAGE_KEY,
        String(lastSyncedSteps + stepsToSend)
      );
    } catch (error) {
      console.error('[useStepSync] step sync failed', error);
    }
  }, []);
  //로컬 걸음 동기화 초기화
  const resetSync = useCallback(async () => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, '0');
      console.log('[useStepSync] LAST_SYNCED_STEPS 초기화 완료');
    } catch (error) {
      console.error('[useStepSync] 초기화 실패', error);
    }
  }, []);

  return { syncSteps, resetSync };
};
