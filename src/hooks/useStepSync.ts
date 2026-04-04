import { postDailyWalks } from '@api/mainApi';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCallback } from 'react';
import { formatDateKeyKST } from '@utils/dateUtil';
import { STEP_SYNC_UPLOAD_POLICY } from '@utils/stepSyncPolicy';

const STORAGE_KEY = 'LAST_SYNCED_STEPS';
const STORAGE_DATE_KEY = 'LAST_SYNCED_DATE';

export const useStepSync = () => {
  const syncSteps = useCallback(async (currentSteps: number) => {
    try {
      // 오늘 날짜 key
      const todayKey = formatDateKeyKST(new Date());

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

      if (__DEV__) {
        console.log('---------------- STEP SYNC DEBUG ----------------');
        console.log('currentSteps:', currentSteps);
        console.log('lastSyncedSteps:', lastSyncedSteps);
        console.log('calculated diff:', diff);
        console.log('--------------------------------------------------');
      }

      if (diff < STEP_SYNC_UPLOAD_POLICY.minStepDelta) return;

      if (__DEV__) {
        console.log('서버 전송 step(diff):', diff);
      }
      // 증가분만 전송
      await postDailyWalks({
        step: diff,
        distanceKm: 0,
        burnCalories: 0,
      });
      if (__DEV__) {
        console.log('✅ 서버 전송 성공');
      }
      await AsyncStorage.setItem(STORAGE_KEY, String(currentSteps));
    } catch (error) {
      console.error('>>> [useStepSync] step sync failed', error);
    }
  }, []);
  //로컬 걸음 동기화 초기화
  const resetSync = useCallback(async () => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, '0');
      console.log('>>> [useStepSync] LAST_SYNCED_STEPS 초기화 완료');
    } catch (error) {
      console.error('>>> [useStepSync] 초기화 실패', error);
    }
  }, []);

  return { syncSteps, resetSync };
};
