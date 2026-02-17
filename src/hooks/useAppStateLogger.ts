import { useEffect } from 'react';
import { AppState, Platform } from 'react-native';

export default function useAppStateLogger() {
  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextAppState) => {
      console.log(
        `[앱 상태 변경] : ${nextAppState}상태, 찍힌 시간 : ${new Date().toISOString()}`
      );
    });

    return () => subscription.remove();
  }, []);
}
