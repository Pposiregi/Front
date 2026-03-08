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
  HEALTH_STEP_PERMISSIONS,
  HEALTH_STEPS_CACHE_KEY,
  ensureHealthConnectInstalledOrPrompt,
  getCurrentGrantedPermissions,
  type GrantedHealthPermission,
} from '@utils/healthConnect';
import {
  getPreferredStepSyncProvider,
  getStepSyncUnsupportedReason,
} from '@utils/stepSyncProvider';
import {
  getAndroidApiLevel,
  STEP_SYNC_OS_POLICY,
} from '@utils/stepSyncPolicy';

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
  const lastWriteEndRef = useRef<Date | null>(null);
  const permissionDeniedRef = useRef(false);
  const setupPendingRef = useRef(false);
  const lastErrorRef = useRef<string | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const pollingStoppedRef = useRef(false);

  const setStableError = (message: string | null) => {
    if (lastErrorRef.current === message) return;
    lastErrorRef.current = message;
    setError(message);
  };

  const stopPolling = () => {
    if (!intervalRef.current) return;
    clearInterval(intervalRef.current);
    intervalRef.current = null;
  };

  const shouldPausePollingForSetup = () => {
    const apiLevel = getAndroidApiLevel();
    return (
      apiLevel !== null &&
      apiLevel >= STEP_SYNC_OS_POLICY.healthConnectMinApi &&
      apiLevel < 34
    );
  };

  const disablePollingOnUnsupported = () => {
    pollingStoppedRef.current = true;
    stopPolling();
  };

  const pausePollingForSetup = () => {
    stopPolling();
  };

  const resumePolling = () => {
    if (pollingStoppedRef.current || setupPendingRef.current) {
      return;
    }
    stopPolling();
    intervalRef.current = setInterval(() => {
      if (pollingStoppedRef.current || setupPendingRef.current) {
        return;
      }
      if (__DEV__) {
        console.log('[HC] fetchSteps interval tick', new Date().toISOString());
      }
      fetchSteps(false);
    }, 2000);
  };

  const ensureInitializedAndPermitted = async (showPrompt = false) => {
    const apiLevel = getAndroidApiLevel();

    await ensureHealthConnectInstalledOrPrompt(apiLevel ?? 0, {
      showPrompt,
    });

    const isInitialized = await initialize();
    if (!isInitialized) {
      throw new Error('Health Connect를 사용할 수 없습니다.');
    }

    const grantedBeforeRequest = await getCurrentGrantedPermissions();
    if (hasAllPermissions(grantedBeforeRequest, HEALTH_STEP_PERMISSIONS)) {
      permissionDeniedRef.current = false;
      return;
    }

    if (!showPrompt) {
      permissionDeniedRef.current = true;
      throw new Error(
        'Health Connect 권한이 허용되지 않았습니다. 설정에서 권한을 허용해주세요.'
      );
    }

    const grantedAfterRequest: GrantedHealthPermission[] = await requestPermission(
      HEALTH_STEP_PERMISSIONS
    );

    if (!hasAllPermissions(grantedAfterRequest, HEALTH_STEP_PERMISSIONS)) {
      permissionDeniedRef.current = true;
      throw new Error(
        'Health Connect 권한이 허용되지 않았습니다. 설정에서 권한을 허용해주세요.'
      );
    }

    permissionDeniedRef.current = false;
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
      console.warn('>>>[RUNNING][HC] 캐시된 걸음 수 로드 실패', err);
    }
  };

  const fetchSteps = async (showPrompt = false) => {
    if (Platform.OS !== 'android') return;
    if (pollingStoppedRef.current && !showPrompt) return;
    if (setupPendingRef.current && !showPrompt) return;
    const provider = getPreferredStepSyncProvider();
    const unsupportedReason = getStepSyncUnsupportedReason(provider);
    if (unsupportedReason) {
      setStableError(unsupportedReason);
      setSteps(null);
      disablePollingOnUnsupported();
      return;
    }
    if (checkingRef.current) return;
    checkingRef.current = true;
    setLoading(true);
    setStableError(null);

    try {
      await ensureInitializedAndPermitted(showPrompt);
      setupPendingRef.current = false;
      if (shouldPausePollingForSetup()) {
        resumePolling();
      }

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

      if (__DEV__) {
        console.log('[HC] 읽어온 걸음 수:', total);
      }
      // 이전과 값이 다를 때만 set
      setSteps((prev) => (prev === total ? prev : total));
      //setSteps(total);
      try {
        // 최신 결과를 캐시에 저장해 다음 진입/백그라운드 핸들러와 공유
        await AsyncStorage.setItem(
          HEALTH_STEPS_CACHE_KEY,
          JSON.stringify({ date: start.toISOString(), steps: total })
        );
      } catch (err) {
        console.warn('>>>[RUNNING][HC] 걸음 수 캐시 저장 실패', err);
      }
    } catch (err: any) {
      console.error('>>>[RUNNING][HC] 걸음 수 읽기 실패', err);
      setStableError(err?.message ?? '걸음 수를 불러오지 못했습니다.');
      setSteps(null);

      if (shouldPausePollingForSetup()) {
        const isSetupPending =
          err?.message === 'Health Connect가 설치되어 있지 않습니다.' ||
          err?.message === 'Health Connect 업데이트가 필요합니다.' ||
          err?.message ===
            'Health Connect 권한이 허용되지 않았습니다. 설정에서 권한을 허용해주세요.';
        if (isSetupPending) {
          setupPendingRef.current = true;
          pausePollingForSetup();
        } else if (permissionDeniedRef.current && showPrompt) {
          setupPendingRef.current = true;
          pausePollingForSetup();
        } else if (!showPrompt) {
          setupPendingRef.current = false;
        }
      }
    } finally {
      setLoading(false);
      checkingRef.current = false;
    }
  };

  const addSteps = async (delta: number) => {
    if (Platform.OS !== 'android') return;
    if (delta <= 0) {
      setStableError('걸음 수 증분은 1 이상이어야 합니다.');
      return;
    }
    setWriting(true);
    setStableError(null);
    try {
      await ensureInitializedAndPermitted(true);
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
      await fetchSteps(true);
    } catch (err: any) {
      console.error('>>>[RUNNING][HC] 걸음 수 쓰기 실패', err);
      setStableError(err?.message ?? '걸음 수를 기록하지 못했습니다.');
      throw err;
    } finally {
      setWriting(false);
    }
  };

  useEffect(() => {
    loadCachedSteps();
    (async () => {
      await fetchSteps(true);
      if (!pollingStoppedRef.current && !setupPendingRef.current) {
        resumePolling();
      }
    })();

    const handleAppStateChange = (state: AppStateStatus) => {
      if (state === 'active') {
        // 앱 복귀 시 권한 재확인 경로를 열어두기 위해 실패 플래그 리셋
        permissionDeniedRef.current = false;
        (async () => {
          await fetchSteps(true);
          if (!pollingStoppedRef.current && !setupPendingRef.current) {
            resumePolling();
          }
        })();
      } else if (state === 'background' || state === 'inactive') {
        stopPolling();
      }
    };

    const subscription = AppState.addEventListener(
      'change',
      handleAppStateChange
    );
    return () => {
      stopPolling();
      subscription.remove();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { steps, loading, writing, error, addSteps };
};

export default useHealthSteps;
