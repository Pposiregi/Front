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

/**
 * 기기가 Health Connect SDK를 지원하는지 확인하는 함수
 * 사용자가 권한을 부여했는지 확인한 후
 * 매일 사용자의 걸음 수를 동기화하는 훅입니다.
 */

/***
 * 훅 옵션 타입 정의
 * @property enabled 동기화 활성화 여부
 * @property userId 사용자 ID
 * @property milestoneSize 마일스톤 당 걸음 수
 * @property syncIntervalMs 동기화 간격 밀리초
 */
type UseHealthConnectStepsOptions = {
  enabled: boolean;
  userId?: string | null;
  milestoneSize?: number;
  syncIntervalMs?: number;
};

/***
 * 훅 반환 타입 정의
 * @property steps 오늘의 총 걸음 수
 * @property permissionsGranted 권한 부여 여부
 * @property syncing 동기화 중 여부
 * @property lastSyncedMilestone 마지막으로 동기화된 마일스톤 인덱스
 * @property error 오류 메시지
 * @property debugInsertSteps (개발용) 걸음 수 삽입 함수
 */
type UseHealthConnectStepsResult = {
  steps: number | null;
  permissionsGranted: boolean;
  syncing: boolean;
  lastSyncedMilestone: number;
  error: string | null;
  debugInsertSteps?: (count: number) => Promise<void>;
};

/** 로컬 스토리지 키 접두사 및 기본값 정의 */
const STORAGE_KEY_PREFIX = 'healthConnect:lastMilestone';
const DEFAULT_MILESTONE = 1000; // 1000걸음 당 마일스톤
const DEFAULT_SYNC_INTERVAL_MS = 60 * 1000; // 1분

/** 로컬 스토리지 키 생성 함수 */
const buildStorageKey = (userId: string, dateKey: string) =>
  `${STORAGE_KEY_PREFIX}:${userId}:${dateKey}`;

/** Health Connect 권한 설정 */
const REQUIRED_PERMISSIONS = [
  { accessType: 'read' as const, recordType: 'Steps' as const },
];

/** Health Connect 쓰기 권한 설정 (디버그용) */
const WRITE_PERMISSIONS = [
  { accessType: 'write' as const, recordType: 'Steps' as const },
];

/** 하루 시작 시각의 ISO 문자열 반환 함수 */
const getStartOfDayIsoString = (date: Date) => {
  const start = new Date(date);
  start.setHours(0, 0, 0, 0);
  return start.toISOString();
};

/**
 * 마일스톤 값 파싱 함수
 * @param value 파싱할 값
 * @returns  파싱된 마일스톤 값 (유효하지 않으면 0 반환)
 */
const parseMilestoneValue = (value: string | null | undefined) => {
  if (!value) return 0;
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : 0;
};

/**
 *  Health Connect 걸음 수 동기화 훅
 * @param options 훅 옵션
 * @returns 훅 결과
 */
const useHealthConnectSteps = ({
  enabled,
  userId,
  milestoneSize = DEFAULT_MILESTONE,
  syncIntervalMs = DEFAULT_SYNC_INTERVAL_MS,
}: UseHealthConnectStepsOptions): UseHealthConnectStepsResult => {
  /* 상태 변수 정의 */
  const [permissionsGranted, setPermissionsGranted] = useState(false);
  const [steps, setSteps] = useState<number | null>(null);
  const [syncing, setSyncing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /* 참조 변수 정의 */
  const lastMilestoneRef = useRef(0);
  const currentDateKeyRef = useRef<string>(formatDateKey(new Date()));
  const isSyncingRef = useRef(false);
  const hasInitializedStorageRef = useRef(false);

  /** 로컬 스토리지에서 마지막 마일스톤 불러오기 */
  const loadMilestoneFromStorage = useCallback(
    async (dateKey: string) => {
      if (!userId) {
        lastMilestoneRef.current = 0;
        return;
      }
      try {
        // 단말기 로컬 스토리지에서 마지막 마일스톤 인덱스 불러오기
        const stored = await AsyncStorage.getItem(
          buildStorageKey(userId, dateKey)
        );
        lastMilestoneRef.current = parseMilestoneValue(stored);
      } catch (storageError) {
        if (__DEV__) {
          console.log(
            '[HealthConnect] 단말기 로컬 스토리지에서 마지막 마일스톤 불러오기 실패',
            storageError
          );
        }
        lastMilestoneRef.current = 0;
      }
    },
    [userId]
  );

  /** 로컬 스토리지에 마지막 마일스톤 저장 */
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
            '[HealthConnect]  단말기 로컬 스토리지에 마지막 마일스톤 저장 실패',
            storageError
          );
        }
      }
    },
    [userId]
  );

  /** Health Connect 준비 상태 확인 및 초기화 */
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

  /** Health Connect 권한 확인 및 요청 */
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
          '[HealthConnect] 권한 요청 실패하였습니다. ',
          permissionError
        );
      }
      setError('Health Connect 권한 요청에 실패했습니다.');
      return false;
    }
  }, []);

  /** 오늘의 총 걸음 수 조회 */
  const fetchDailySteps = useCallback(async () => {
    const now = new Date();
    const startTime = getStartOfDayIsoString(now);
    const endTime = now.toISOString();

    /**
     * aggregateRecord 함수: Health Connect에서 특정 기록 유형에 대한 집계 데이터를 조회
     */
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

  /**
   * 백엔드에 마일스톤 전송 함수
   * @param payload 전송할 마일스톤 페이로드
   */
  const sendMilestonesToBackend = useCallback(
    async (payload: StepMilestonePayload) => {
      if (__DEV__) {
        console.log('[HealthConnect] POST 마일스톤(1000)', payload);
      }
      await postStepMilestones(payload);
    },
    []
  );

  /** 걸음 수 동기화 함수 */
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

      // Health Connect 준비 상태 확인
      // 안드로이드가 아니며, SDK가 준비되지 않은 경우 종료
      const ready = await ensureHealthConnectReady();
      if (!ready) {
        console.log('>>> [HealthConnect] not ready');
        return;
      }

      // 권한 확인 및 요청
      // HealthConnect 설치와 SDK가 준비되어있는 상태
      const permissionGranted = await ensurePermissions();
      if (!permissionGranted) {
        console.log('>>> [HealthConnect] permission not granted');
        return;
      }

      // 날짜 변경 시 로컬 스토리지에서 해당 날짜의 마지막 마일스톤 불러오기
      const now = new Date();
      const dateKey = formatDateKey(now);
      if (currentDateKeyRef.current !== dateKey) {
        currentDateKeyRef.current = dateKey;
        lastMilestoneRef.current = 0;
        await loadMilestoneFromStorage(dateKey);
      }

      // 오늘의 총 걸음 수 조회, syncIntervalMs 간격으로 조회
      const totalSteps = await fetchDailySteps();
      console.log('>>> [HealthConnect] 오늘의 총 걸음 수:', totalSteps);
      setSteps(totalSteps);

      // 마일스톤 계산 및 백엔드 전송
      const normalizedMilestoneSize =
        typeof milestoneSize === 'number' && milestoneSize > 0
          ? milestoneSize
          : DEFAULT_MILESTONE;
      if (__DEV__ && normalizedMilestoneSize !== milestoneSize) {
        console.warn(
          '[HealthConnect] milestoneSize must be > 0. Falling back to default.',
          { milestoneSize, fallback: normalizedMilestoneSize }
        );
      }
      const milestoneIndex = Math.floor(totalSteps / normalizedMilestoneSize);
      const lastSyncedMilestone = lastMilestoneRef.current;

      // 새로운 마일스톤이 없으면 종료
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

      // 전송할 마일스톤 배열 생성
      const milestones: StepMilestoneUpdate[] = [];
      for (
        let milestone = lastSyncedMilestone + 1;
        milestone <= milestoneIndex;
        milestone += 1
      ) {
        milestones.push({
          milestone,
          stepCount: milestone * normalizedMilestoneSize,
          recordedAt: now.toISOString(),
        });
      }

      // 백엔드에 마일스톤 전송
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

  /**
   * 효과 훅: 동기화 활성화 시 걸음 수 동기화 시작
   * @returns 정리 함수
   */
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

  /** (개발용) 걸음 수 삽입 함수 */
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

        // 현재 시각으로부터 5분 전부터 현재 시각까지 걸음 수 삽입
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
