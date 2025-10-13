import { useCallback, useEffect, useRef, useState } from 'react';
import {
  AppState,
  AppStateStatus,
  PermissionsAndroid,
  Platform,
} from 'react-native';
import Pedometer from '@t2tx/react-native-universal-pedometer';

type StepState = {
  stepCount: number;
  isAvailable: boolean;
};

/**
 * 기기 걸음 수를 구독하는 커스텀 훅
 * - Android 10(Q)+: ACTIVITY_RECOGNITION 권한 필요
 * - iOS: Info.plist에 NSMotionUsageDescription 필요 -- ios SKIP!!
 */
export const useStepCount = (): StepState => {
  const [stepState, setStepState] = useState<StepState>({
    stepCount: 0,
    isAvailable: false,
  });
  const appStateRef = useRef<AppStateStatus>(AppState.currentState);
  const startOfDayRef = useRef<number | null>(null);

  /**
   * FitPet App을 백그라운드로 이동/재활성화 시 수행
   * - pedometer 스트림이 잠시 끊길 경우를 방지
   * - 오늘 자정 이후 누적 걸음 수를 다시 조회해 UI의 COUNT 수를 보정함
   */
  const syncStepsFromHistory = useCallback(() => {
    if (Platform.OS !== 'android') return; // ios SKIP!!
    if (startOfDayRef.current == null) return;

    const rangeStart = startOfDayRef.current;
    const rangeEnd = Date.now();

    Pedometer.queryPedometerDataBetweenDates(
      rangeStart,
      rangeEnd,

      /* ExceptionHandling */
      // 히스토리 조회 실패 시, 기존 Count 유지
      (error, data) => {
        if (error || !data) {
          return;
        }

        // 걸음 수가 음수로 내려가는 경우는 없으므로, 0 미만일 경우 0으로 보정
        const steps =
          typeof data.numberOfSteps === 'number' ? data.numberOfSteps : 0;

        console.log(`>>> [Pedometer] 최신 걸음 수: ${steps} steps`);
        setStepState((prev) => ({
          ...prev,
          stepCount: steps,
          isAvailable: true,
        }));
      }
    );
  }, []);

  useEffect(() => {
    let mounted = true;

    const requestPermissionIfNeeded = async () => {
      if (Platform.OS !== 'android') return true;

      // Android 10(API 29) 미만에서는 권한이 필요하지 않음
      if (Platform.Version < 29) return true;

      const permission = PermissionsAndroid.PERMISSIONS.ACTIVITY_RECOGNITION;
      const granted = await PermissionsAndroid.check(permission);
      if (granted) return true;

      const result = await PermissionsAndroid.request(permission, {
        title: '걸음 수 접근 권한',
        message: '오늘 걸음 수를 확인하려면 활동 인식 권한이 필요합니다.',
        buttonPositive: '허용',
      });

      return result === PermissionsAndroid.RESULTS.GRANTED;
    };

    /**
     * 걸음 수 카운트 시작
     * 접근 비허가/미지원 시 -> mounted 시점에 isAvaliable false 초기화
     */
    const startCounter = async () => {
      const hasPermission = await requestPermissionIfNeeded();
      if (!hasPermission) {
        if (mounted) setStepState((prev) => ({ ...prev, isAvailable: false }));
        return;
      }

      Pedometer.isStepCountingAvailable((error, available) => {
        if (!mounted) return;
        if (error || !available) {
          setStepState((prev) => ({ ...prev, isAvailable: false }));
          return;
        }

        setStepState({ stepCount: 0, isAvailable: true });

        // 오늘 자정부터 카운트 시작
        const start = new Date();
        start.setHours(0, 0, 0, 0);
        startOfDayRef.current = start.getTime();

        // 앱 재개 이전에 누적된 걸음 수를 먼저 동기화하여 초기값 보정
        syncStepsFromHistory();

        Pedometer.startPedometerUpdatesFromDate(start.getTime(), (data) => {
          if (!mounted) return;
          const steps =
            typeof data?.numberOfSteps === 'number' ? data.numberOfSteps : 0;
          setStepState({ stepCount: steps, isAvailable: true });
        });
      });
    };

    startCounter();

    return () => {
      mounted = false;
      Pedometer.stopPedometerUpdates();
    };
  }, [syncStepsFromHistory]);

  useEffect(() => {
    const handleAppStateChange = (nextState: AppStateStatus) => {
      const wasBackground =
        appStateRef.current === 'background' ||
        appStateRef.current === 'inactive';

      if (nextState === 'active' && wasBackground) {
        // 백그라운드 -> 포그라운드 전환 시 누적 걸음 수를 다시 가져와 보정
        syncStepsFromHistory();
      }

      appStateRef.current = nextState;
    };

    const subscription = AppState.addEventListener(
      'change',
      handleAppStateChange
    );

    return () => {
      subscription.remove();
    };
  }, [syncStepsFromHistory]);

  return stepState;
};

export default useStepCount;
