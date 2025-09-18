import { useEffect, useState } from 'react';
import { PermissionsAndroid, Platform } from 'react-native';
import Pedometer from 'react-native-pedometer';

type StepState = {
  stepCount: number;
  isAvailable: boolean;
};

/**
 * 기기 걸음 수를 구독하는 커스텀 훅
 * - Android 10(Q) 이상에서는 ACTIVITY_RECOGNITION 권한 요청 필요
 * - iOS는 CoreMotion 접근 허용 팝업 문구가 Info.plist에 있어야 함
 */
export const useStepCount = (): StepState => {
  const [stepState, setStepState] = useState<StepState>({
    stepCount: 0,
    isAvailable: false,
  });

  useEffect(() => {
    let mounted = true;

    const requestPermissionIfNeeded = async () => {
      if (Platform.OS !== 'android') {
        return true;
      }

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

    const startPedometer = async () => {
      const hasPermission = await requestPermissionIfNeeded();
      if (!hasPermission) {
        if (mounted) {
          setStepState((prev) => ({ ...prev, isAvailable: false }));
        }
        return;
      }

      Pedometer.isStepCountingAvailable((error, available) => {
        if (!mounted) {
          return;
        }
        if (error || !available) {
          setStepState((prev) => ({ ...prev, isAvailable: false }));
          return;
        }

        setStepState({ stepCount: 0, isAvailable: true });

        const start = new Date();
        start.setHours(0, 0, 0, 0);

        Pedometer.startPedometerUpdatesFromDate(start.getTime(), (data) => {
          if (!mounted) {
            return;
          }
          const steps = typeof data?.numberOfSteps === 'number' ? data.numberOfSteps : 0;
          setStepState({ stepCount: steps, isAvailable: true });
        });
      });
    };

    startPedometer();

    return () => {
      mounted = false;
      Pedometer.stopPedometerUpdates();
    };
  }, []);

  return stepState;
};

export default useStepCount;
