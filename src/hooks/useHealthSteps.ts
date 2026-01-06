import { useEffect, useRef, useState } from 'react';
import { Alert, AppState, AppStateStatus, Platform } from 'react-native';
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
  const BG_RATIONALE_SHOWN_KEY = 'fitpet:health:bgPermissionRationale';
  const [steps, setSteps] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [writing, setWriting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const checkingRef = useRef(false);
  const lastWriteEndRef = useRef<Date | null>(null);

  const ensureBackgroundRationaleAcknowledged = async () => {
    // BackgroundAccessPermission은 민감하므로 한 번은 목적을 안내한다.
    const shown = await AsyncStorage.getItem(BG_RATIONALE_SHOWN_KEY);
    if (shown) return;

    const acknowledged = await new Promise<boolean>((resolve) => {
      Alert.alert(
        'Health Connect 백그라운드 권한 안내',
        '백그라운드에서도 걸음 수를 동기화하기 위해 Health Connect 백그라운드 접근 권한이 필요합니다.',
        [
          { text: '취소', style: 'cancel', onPress: () => resolve(false) },
          { text: '계속', onPress: () => resolve(true) },
        ]
      );
    });
    if (!acknowledged) {
      throw new Error('백그라운드 권한 안내에 동의하지 않았습니다.');
    }
    await AsyncStorage.setItem(BG_RATIONALE_SHOWN_KEY, '1');
  };

  const ensureInitializedAndPermitted = async () => {
    // HC SDK 초기화 + 필수 권한 확인
    const isInitialized = await initialize();
    if (!isInitialized) {
      throw new Error('Health Connect를 사용할 수 없습니다.');
    }
    await ensureBackgroundRationaleAcknowledged();
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
    if (delta <= 0) {
      setError('걸음 수 증분은 1 이상이어야 합니다.');
      return;
    }
    setWriting(true);
    setError(null);
    try {
      await ensureInitializedAndPermitted();
      const now = new Date();
      // 마지막 기록 종료 시각 이후로부터 현재까지를 구간으로 설정해 중복/겹침 최소화
      const startTime =
        lastWriteEndRef.current && lastWriteEndRef.current < now
          ? lastWriteEndRef.current
          : new Date(now.getTime() - 5 * 60 * 1000);
      await insertRecords([
        {
          recordType: 'Steps',
          count: delta,
          startTime: startTime.toISOString(),
          endTime: now.toISOString(),
        },
      ]);
      lastWriteEndRef.current = now;
      await fetchSteps();
    } catch (err: any) {
      console.error('>>> [HC] 걸음 수 쓰기 실패', err);
      setError(err?.message ?? '걸음 수를 기록하지 못했습니다.');
      throw err;
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
