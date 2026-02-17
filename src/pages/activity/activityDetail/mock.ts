import { GPS_LOG, SessionDetail } from './types';

/**
 * 세션별 GPS 경로 목업 데이터.
 */
export const mock_gps_log: Record<string, GPS_LOG[]> = {
  S_AM_0830: [
    { latitude: 35.1516, longitude: 128.9976, altitude: 15.0 },
    { latitude: 35.1498, longitude: 128.998, altitude: 18.5 },
    { latitude: 35.1485, longitude: 128.9984, altitude: 20.2 },
    { latitude: 35.1483, longitude: 129.0018, altitude: 25.8 },
    { latitude: 35.1485, longitude: 129.0035, altitude: 22.1 },
    { latitude: 35.1505, longitude: 129.0033, altitude: 19.9 },
    { latitude: 35.152, longitude: 129.0031, altitude: 17.5 },
    { latitude: 35.1521, longitude: 129.001, altitude: 16.2 },
    { latitude: 35.152, longitude: 128.9987, altitude: 15.1 },
  ],

  S_PM_1930: [
    { latitude: 35.1516, longitude: 128.9976, altitude: 15.0 },
    { latitude: 35.1498, longitude: 128.998, altitude: 18.5 },
    { latitude: 35.1485, longitude: 128.9984, altitude: 20.2 },
    { latitude: 35.1483, longitude: 129.0018, altitude: 25.8 },
    { latitude: 35.1485, longitude: 129.0035, altitude: 22.1 },
    { latitude: 35.1505, longitude: 129.0033, altitude: 19.9 },
    { latitude: 35.152, longitude: 129.0031, altitude: 17.5 },
    { latitude: 35.1521, longitude: 129.001, altitude: 16.2 },
    { latitude: 35.152, longitude: 128.9987, altitude: 15.1 },
  ],
};

/**
 * GPS 세션 상세 목업 메타데이터.
 */
export const mockSessionMetadata: Record<
  string,
  Omit<SessionDetail, 'routeLogs'>
> = {
  S_AM_0830: {
    startTime: '2026-01-09T08:30:00.000Z',
    endTime: '2026-01-09T11:00:17.000Z',
    totalDistance: 6.5,
    // m/s
    avgSpeedMps: 1.25,
    avgSpeedKmh: 4.5,
    stepCount: 8900,
    burnCalories: 246,
  },
  S_PM_1930: {
    startTime: '2026-01-09T19:30:00.000Z',
    endTime: '2026-01-09T21:00:00.000Z',
    totalDistance: 4.8,
    // m/s
    avgSpeedMps: 0.89,
    avgSpeedKmh: 3.2,
    stepCount: 6100,
    burnCalories: 180,
  },
};
