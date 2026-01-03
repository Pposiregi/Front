import { useEffect, useRef } from 'react';
import {
  initialize,
  insertRecords,
  readRecords,
  requestPermission,
} from 'react-native-health-connect';
import { Platform } from 'react-native';

const useHealthConnectDemo = () => {
  const hasRunRef = useRef(false);

  useEffect(() => {
    if (hasRunRef.current) return;
    hasRunRef.current = true;

    if (Platform.OS !== 'android') return;

    // 샘플 데이터는 개발 환경에서만 기록
    if (!__DEV__) {
      console.log('>>> [HC] 프로덕션에서는 샘플 걸음 기록을 생략합니다.');
      return;
    }

    const run = async () => {
      try {
        console.log('>>> [HC] Health Connect 데모 시작');
        const isInitialized = await initialize();
        if (!isInitialized) {
          console.warn('>>> [HC] Health Connect를 사용할 수 없습니다');
          return;
        }

        await requestPermission([
          { accessType: 'read', recordType: 'Steps' },
          { accessType: 'read', recordType: 'Weight' },
          { accessType: 'read', recordType: 'Height' },
          { accessType: 'write', recordType: 'Steps' },
          { accessType: 'write', recordType: 'Weight' },
          { accessType: 'write', recordType: 'Height' },
          { accessType: 'read', recordType: 'BackgroundAccessPermission' },
        ]);

        const now = new Date();
        const startOfDay = new Date(now);
        startOfDay.setHours(0, 0, 0, 0);

        // 걸음 수 샘플 기록 (에뮬레이터 테스트용)
        await insertRecords([
          {
            recordType: 'Steps',
            count: 8500,
            startTime: startOfDay.toISOString(),
            endTime: now.toISOString(),
          },
        ]);

        // 걸음 수 읽기
        const stepsResult = await readRecords('Steps', {
          timeRangeFilter: {
            operator: 'between',
            startTime: startOfDay.toISOString(),
            endTime: now.toISOString(),
          },
        });

        const totalSteps = stepsResult.records.reduce(
          (sum: number, record: any) => sum + (record.count || 0),
          0
        );

        console.log('>>> [HC] 샘플 걸음 기록/조회 완료', { totalSteps });
      } catch (error) {
        console.error('>>> [HC] 샘플 걸음 기록/조회 실패', error);
      }
    };

    run();
  }, []);
};

export default useHealthConnectDemo;
