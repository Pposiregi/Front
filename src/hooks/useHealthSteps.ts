import { useEffect, useRef, useState } from 'react';
import { AppState, AppStateStatus, Platform } from 'react-native';
import {
  initialize,
  insertRecords,
  readRecords,
  requestPermission,
  type Permission,
  type BackgroundAccessPermission,
} from 'react-native-health-connect';

type HealthStepsState = {
  steps: number | null;
  loading: boolean;
  writing: boolean;
  error: string | null;
  addSteps: (delta: number) => Promise<void>;
};

const HEALTH_PERMISSIONS: (Permission | BackgroundAccessPermission)[] = [
  { accessType: 'read', recordType: 'Steps' },
  { accessType: 'write', recordType: 'Steps' },
  { accessType: 'read', recordType: 'BackgroundAccessPermission' },
];

const getStartOfToday = () => {
  const now = new Date();
  const start = new Date(now);
  start.setHours(0, 0, 0, 0);
  return { start, end: now };
};

const useHealthSteps = (): HealthStepsState => {
  const [steps, setSteps] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [writing, setWriting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const checkingRef = useRef(false);

  const ensureInitializedAndPermitted = async () => {
    const isInitialized = await initialize();
    if (!isInitialized) {
      throw new Error('Health Connect를 사용할 수 없습니다.');
    }
    await requestPermission(HEALTH_PERMISSIONS);
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
    fetchSteps();

    const handleAppStateChange = (state: AppStateStatus) => {
      if (state === 'active') {
        fetchSteps();
      }
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);
    return () => subscription.remove();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { steps, loading, writing, error, addSteps };
};

export default useHealthSteps;
