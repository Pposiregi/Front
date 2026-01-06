import { useEffect, useRef, useState } from 'react';
import { AppState, AppStateStatus, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  initialize,
  insertRecords,
  readRecords,
  requestPermission,
} from 'react-native-health-connect';
import {
  getStartOfToday,
  hasAllPermissions,
  HEALTH_PERMISSIONS,
  HEALTH_STEPS_CACHE_KEY,
  type GrantedHealthPermission,
} from '@utils/healthConnect';

type HealthStepsState = {
  steps: number | null;
  loading: boolean;
  writing: boolean;
  error: string | null;
  addSteps: (delta: number) => Promise<void>;
};

const useHealthSteps = (): HealthStepsState => {
  const [steps, setSteps] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [writing, setWriting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const checkingRef = useRef(false);

  const ensureInitializedAndPermitted = async () => {
    // HC SDK 초기화 + 필수 권한 확인
    const isInitialized = await initialize();
    if (!isInitialized) {
      throw new Error('Health Connect를 사용할 수 없습니다.');
    }
    const granted: GrantedHealthPermission[] =
      await requestPermission(HEALTH_PERMISSIONS);
    if (!hasAllPermissions(granted)) {
      throw new Error(
        'Health Connect 권한이 허용되지 않았습니다. 설정에서 권한을 허용해주세요.'
      );
    }
  };

  const loadCachedSteps = async () => {
    // 백그라운드 동기화가 저장한 금일 걸음 수 캐시가 있으면 UI에 선반영
    try {
      const raw = await AsyncStorage.getItem(HEALTH_STEPS_CACHE_KEY);
      if (!raw) return;
      const cached = JSON.parse(raw) as { date: string; steps: number };
      const { start } = getStartOfToday();
      if (cached?.date === start.toISOString()) {
        setSteps(cached.steps);
      }
    } catch (err) {
      console.warn('[HC] 캐시된 걸음 수 로드 실패', err);
    }
  };

  const fetchSteps = async () => {
    if (Platform.OS !== 'android') return;
    if (checkingRef.current) return;
    checkingRef.current = true;
    setLoading(true);
    setError(null);

    try {
      await ensureInitializedAndPermitted();

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
      setSteps(total);
      try {
        // 최신 결과를 캐시에 저장해 다음 진입/백그라운드 핸들러와 공유
        await AsyncStorage.setItem(
          HEALTH_STEPS_CACHE_KEY,
          JSON.stringify({ date: start.toISOString(), steps: total })
        );
      } catch (err) {
        console.warn('[HC] 걸음 수 캐시 저장 실패', err);
      }
    } catch (err: any) {
      console.error('>>> [HC] 걸음 수 읽기 실패', err);
      setError(err?.message ?? '걸음 수를 불러오지 못했습니다.');
      setSteps(null);
    } finally {
      setLoading(false);
      checkingRef.current = false;
    }
  };

  const addSteps = async (delta: number) => {
    if (Platform.OS !== 'android') return;
    setWriting(true);
    setError(null);
    try {
      await ensureInitializedAndPermitted();
      const now = new Date();
      const startTime = new Date(now.getTime() - 5 * 60 * 1000); // 최근 5분 구간
      await insertRecords([
        {
          recordType: 'Steps',
          count: delta,
          startTime: startTime.toISOString(),
          endTime: now.toISOString(),
        },
      ]);
      await fetchSteps();
    } catch (err: any) {
      console.error('>>> [HC] 걸음 수 쓰기 실패', err);
      setError(err?.message ?? '걸음 수를 기록하지 못했습니다.');
    } finally {
      setWriting(false);
    }
  };

  useEffect(() => {
    loadCachedSteps();

    fetchSteps();

    const handleAppStateChange = (state: AppStateStatus) => {
      if (state === 'active') {
        fetchSteps();
      }
    };

    const subscription = AppState.addEventListener(
      'change',
      handleAppStateChange
    );
    return () => subscription.remove();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { steps, loading, writing, error, addSteps };
};

export default useHealthSteps;
