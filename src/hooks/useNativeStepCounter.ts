import { useEffect, useRef, useState } from 'react';
import { PermissionsAndroid, Platform } from 'react-native';
import StepSensorModule, { stepSensorEmitter } from '@native/StepSensorModule';

const requestActivityRecognition = async (): Promise<boolean> => {
  if (Platform.OS !== 'android') return false;
  if (Platform.Version < 29) return true; // Android 10 미만은 권한 불필요

  const granted = await PermissionsAndroid.request(
    PermissionsAndroid.PERMISSIONS.ACTIVITY_RECOGNITION
  );
  return granted === PermissionsAndroid.RESULTS.GRANTED;
};

export const useNativeStepCounter = (active: boolean) => {
  const [steps, setSteps] = useState(0);
  const stepsRef = useRef(0);
  const startTotalRef = useRef<number | null>(null);

  useEffect(() => {
    if (!active) return;

    stepsRef.current = 0;
    startTotalRef.current = null;
    setSteps(0);

    let sub: ReturnType<typeof stepSensorEmitter.addListener> | null = null;

    requestActivityRecognition().then((granted) => {
      if (!granted) return;

      StepSensorModule.startListening();

      sub = stepSensorEmitter.addListener(
        'StepCounterUpdate',
        (total: number) => {
          // 리스너 등록 직후 첫 이벤트는 현재 부팅 누적값 → 시작값으로 저장
          if (startTotalRef.current === null) {
            startTotalRef.current = total;
            return;
          }
          const sessionSteps = Math.max(0, total - startTotalRef.current);
          stepsRef.current = sessionSteps;
          setSteps(sessionSteps);
        }
      );
    });

    return () => {
      StepSensorModule.stopListening();
      sub?.remove();
    };
  }, [active]);

  return { steps, stepsRef };
};
