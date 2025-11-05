import { useCallback, useEffect, useRef, useState } from 'react';
import { AppState, AppStateStatus, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  SdkAvailabilityStatus,
  aggregateRecord,
  getGrantedPermissions,
  getSdkStatus,
  initialize,
  insertRecords,
  requestPermission,
} from 'react-native-health-connect';
import { formatDateKey } from '@utils/dateUtil';
import {
  StepMilestonePayload,
  StepMilestoneUpdate,
  postStepMilestones,
} from '@api/healthConnectApi';

type UseHealthConnectStepsOptions = {
  enabled: boolean;
  userId?: string | null;
  milestoneSize?: number;
  syncIntervalMs?: number;
};

type UseHealthConnectStepsResult = {
  steps: number | null;
  permissionsGranted: boolean;
  syncing: boolean;
  lastSyncedMilestone: number;
  error: string | null;
  debugInsertSteps?: (count: number) => Promise<void>;
};

const STORAGE_KEY_PREFIX = 'healthConnect:lastMilestone';
const DEFAULT_MILESTONE = 1000;
const DEFAULT_SYNC_INTERVAL_MS = 60 * 1000;

const buildStorageKey = (userId: string, dateKey: string) =>
  `${STORAGE_KEY_PREFIX}:${userId}:${dateKey}`;

const REQUIRED_PERMISSIONS = [
  { accessType: 'read' as const, recordType: 'Steps' as const },
];

const WRITE_PERMISSIONS = [
  { accessType: 'write' as const, recordType: 'Steps' as const },
];

const getStartOfDayIsoString = (date: Date) => {
  const start = new Date(date);
  start.setHours(0, 0, 0, 0);
  return start.toISOString();
};

const parseMilestoneValue = (value: string | null | undefined) => {
  if (!value) return 0;
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : 0;
};

const useHealthConnectSteps = ({
  enabled,
  userId,
  milestoneSize = DEFAULT_MILESTONE,
  syncIntervalMs = DEFAULT_SYNC_INTERVAL_MS,
}: UseHealthConnectStepsOptions): UseHealthConnectStepsResult => {
  const [permissionsGranted, setPermissionsGranted] = useState(false);
  const [steps, setSteps] = useState<number | null>(null);
  const [syncing, setSyncing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const lastMilestoneRef = useRef(0);
  const currentDateKeyRef = useRef<string>(formatDateKey(new Date()));
  const isSyncingRef = useRef(false);
  const hasInitializedStorageRef = useRef(false);

  const loadMilestoneFromStorage = useCallback(
    async (dateKey: string) => {
      if (!userId) {
        lastMilestoneRef.current = 0;
        return;
      }
      try {
        const stored = await AsyncStorage.getItem(
          buildStorageKey(userId, dateKey)
        );
        lastMilestoneRef.current = parseMilestoneValue(stored);
      } catch (storageError) {
        if (__DEV__) {
          console.log(
            '[HealthConnect] failed to load milestone from storage',
            storageError
          );
        }
        lastMilestoneRef.current = 0;
      }
    },
    [userId]
  );

  const persistMilestone = useCallback(
    async (dateKey: string, milestone: number) => {
      if (!userId) return;
      try {
        await AsyncStorage.setItem(
          buildStorageKey(userId, dateKey),
          milestone.toString()
        );
      } catch (storageError) {
        if (__DEV__) {
          console.log(
            '[HealthConnect] failed to persist milestone',
            storageError
          );
        }
      }
    },
    [userId]
  );

  const ensureHealthConnectReady = useCallback(async () => {
    if (Platform.OS !== 'android') {
      setError('Health Connect is only available on Android.');
      return false;
    }

    const status = await getSdkStatus();
    if (__DEV__) {
      console.log('[HealthConnect] ensure ready - status', status);
    }

    if (status !== SdkAvailabilityStatus.SDK_AVAILABLE) {
      setError('Health Connect SDK is not available on this device.');
      return false;
    }

    try {
      await initialize();
      return true;
    } catch (initError) {
      if (__DEV__) {
        console.log('[HealthConnect] initialize failed', initError);
      }
      setError('Health Connect 초기화에 실패했습니다.');
      return false;
    }
  }, []);

  const ensurePermissions = useCallback(async () => {
    try {
      const granted = await getGrantedPermissions();
      const hasPermission = granted.some(
        (permission) =>
          'recordType' in permission &&
          permission.recordType === 'Steps' &&
          permission.accessType === 'read'
      );

      if (hasPermission) {
        setPermissionsGranted(true);
        return true;
      }

      const result = await requestPermission(REQUIRED_PERMISSIONS);
      const permissionGranted = result.some(
        (permission) =>
          'recordType' in permission &&
          permission.recordType === 'Steps' &&
          permission.accessType === 'read'
      );
      setPermissionsGranted(permissionGranted);
      return permissionGranted;
    } catch (permissionError) {
      if (__DEV__) {
        console.log(
          '[HealthConnect] permission request failed',
          permissionError
        );
      }
      setError('Health Connect 권한 요청에 실패했습니다.');
      return false;
    }
  }, []);

  const fetchDailySteps = useCallback(async () => {
    const now = new Date();
    const startTime = getStartOfDayIsoString(now);
    const endTime = now.toISOString();

    const aggregate = await aggregateRecord<'Steps'>({
      recordType: 'Steps',
      timeRangeFilter: {
        operator: 'between',
        startTime,
        endTime,
      },
    });

    return aggregate.COUNT_TOTAL ?? 0;
  }, []);

  const sendMilestonesToBackend = useCallback(
    async (payload: StepMilestonePayload) => {
      if (__DEV__) {
        console.log('[HealthConnect] POST milestones', payload);
      }
      await postStepMilestones(payload);
    },
    []
  );

  const syncSteps = useCallback(async () => {
    if (!enabled || !userId || isSyncingRef.current) {
      return;
    }

    isSyncingRef.current = true;
    setSyncing(true);
    setError(null);

    try {
      if (!hasInitializedStorageRef.current) {
        const currentDateKey = formatDateKey(new Date());
        currentDateKeyRef.current = currentDateKey;
        await loadMilestoneFromStorage(currentDateKey);
        hasInitializedStorageRef.current = true;
      }

      const ready = await ensureHealthConnectReady();
      if (!ready) {
        return;
      }

      const permissionGranted = await ensurePermissions();
      if (!permissionGranted) {
        return;
      }

      const now = new Date();
      const dateKey = formatDateKey(now);
      if (currentDateKeyRef.current !== dateKey) {
        currentDateKeyRef.current = dateKey;
        lastMilestoneRef.current = 0;
        await loadMilestoneFromStorage(dateKey);
      }

      const totalSteps = await fetchDailySteps();
      setSteps(totalSteps);

      const milestoneIndex = Math.floor(totalSteps / milestoneSize);
      const lastSyncedMilestone = lastMilestoneRef.current;

      if (milestoneIndex <= lastSyncedMilestone) {
        if (__DEV__) {
          console.log(
            '[HealthConnect] no new milestone',
            JSON.stringify({
              totalSteps,
              milestoneIndex,
              lastSyncedMilestone,
            })
          );
        }
        return;
      }

      const milestones: StepMilestoneUpdate[] = [];
      for (
        let milestone = lastSyncedMilestone + 1;
        milestone <= milestoneIndex;
        milestone += 1
      ) {
        milestones.push({
          milestone,
          stepCount: milestone * milestoneSize,
          recordedAt: now.toISOString(),
        });
      }

      if (milestones.length > 0) {
        const payload: StepMilestonePayload = {
          userId,
          date: dateKey,
          source: 'health_connect',
          milestones,
        };
        if (__DEV__) {
          console.log('[HealthConnect] synced milestones', payload);
        }
        await sendMilestonesToBackend(payload);
        lastMilestoneRef.current = milestoneIndex;
        await persistMilestone(dateKey, milestoneIndex);
      }
    } catch (syncError) {
      if (__DEV__) {
        console.log('[HealthConnect] sync failed', syncError);
      }
      setError(
        syncError instanceof Error
          ? syncError.message
          : 'Health Connect 동기화 실패'
      );
    } finally {
      setSyncing(false);
      isSyncingRef.current = false;
    }
  }, [
    enabled,
    ensureHealthConnectReady,
    ensurePermissions,
    fetchDailySteps,
    loadMilestoneFromStorage,
    milestoneSize,
    persistMilestone,
    sendMilestonesToBackend,
    userId,
  ]);

  useEffect(() => {
    if (!enabled || !userId) {
      return;
    }

    hasInitializedStorageRef.current = false;
    syncSteps();

    const intervalId = setInterval(() => {
      syncSteps();
    }, syncIntervalMs);

    return () => {
      clearInterval(intervalId);
    };
  }, [enabled, syncIntervalMs, syncSteps, userId]);

  useEffect(() => {
    if (!enabled || !userId) return;

    const handleAppStateChange = (nextState: AppStateStatus) => {
      if (nextState === 'active') {
        syncSteps();
      }
    };

    const subscription = AppState.addEventListener(
      'change',
      handleAppStateChange
    );
    return () => subscription.remove();
  }, [enabled, syncSteps, userId]);

  const debugInsertSteps = useCallback(
    async (count: number) => {
      if (!__DEV__) return;
      if (!enabled || !userId) {
        console.log('[HealthConnect][debug] disabled or missing user');
        return;
      }

      const ready = await ensureHealthConnectReady();
      if (!ready) return;

      try {
        const granted = await getGrantedPermissions();
        const hasWrite =
          granted?.some(
            (permission) =>
              'recordType' in permission &&
              permission.recordType === 'Steps' &&
              permission.accessType === 'write'
          ) ?? false;

        if (!hasWrite) {
          const result = await requestPermission([
            ...REQUIRED_PERMISSIONS,
            ...WRITE_PERMISSIONS,
          ]);
          const writeGranted = result.some(
            (permission) =>
              'recordType' in permission &&
              permission.recordType === 'Steps' &&
              permission.accessType === 'write'
          );
          if (!writeGranted) {
            console.log('[HealthConnect][debug] write permission denied');
            return;
          }
        }

        const end = new Date();
        const start = new Date(end.getTime() - 5 * 60 * 1000);
        await insertRecords([
          {
            recordType: 'Steps',
            count,
            startTime: start.toISOString(),
            endTime: end.toISOString(),
          },
        ]);
        console.log(`[HealthConnect][debug] inserted ${count} steps`);
        await syncSteps();
      } catch (debugError) {
        console.log('[HealthConnect][debug] insert failed', debugError);
      }
    },
    [enabled, ensureHealthConnectReady, syncSteps, userId]
  );

  return {
    steps,
    permissionsGranted,
    syncing,
    lastSyncedMilestone: lastMilestoneRef.current,
    error,
    debugInsertSteps: __DEV__ ? debugInsertSteps : undefined,
  };
};

export default useHealthConnectSteps;
