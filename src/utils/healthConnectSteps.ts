import {
  initialize,
  readRecords,
  requestPermission,
} from 'react-native-health-connect';
import {
  HEALTH_PERMISSIONS,
  hasAllPermissions,
  isAndroid,
  type GrantedHealthPermission,
} from '@utils/healthConnect';

const toIsoString = (value: string | Date) =>
  value instanceof Date ? value.toISOString() : value;

/**
 * Health Connect 구간 걸음 수 합산
 * - 입력: startTime, endTime
 * - 출력: stepCount 합계
 */
export const getHealthConnectStepCount = async (
  startTime: string | Date,
  endTime: string | Date
): Promise<number> => {
  if (!isAndroid()) return 0;

  try {
    const isInitialized = await initialize();
    if (!isInitialized) {
      throw new Error('Health Connect를 사용할 수 없습니다.');
    }

    const granted: GrantedHealthPermission[] =
      await requestPermission(HEALTH_PERMISSIONS);
    if (!hasAllPermissions(granted)) {
      throw new Error(
        'Health Connect 권한이 허용되지 않았습니다. 설정에서 권한을 허용해주세요.'
      );
    }

    const result = await readRecords('Steps', {
      timeRangeFilter: {
        operator: 'between',
        startTime: toIsoString(startTime),
        endTime: toIsoString(endTime),
      },
    });

    return result.records.reduce(
      (sum: number, record: any) => sum + (record.count || 0),
      0
    );
  } catch (err) {
    console.error('>>> [HC] 구간 걸음 수 합산 실패', err);
    throw err;
  }
};
