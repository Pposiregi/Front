import { GPS_SESSION } from 'types/activity';

export const getDateString = (daysAgo: number): string => {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  return date.toISOString().split('T')[0];
};

// 월별 활동 기록을 시뮬레이션하기 위한 목업 데이터
// 2026년 1월, 2025년 12월, 2025년 11월 데이터를 가정
export const mock_data_by_month: { [key: string]: GPS_SESSION[] } = {
  // 2026-01월 데이터
  '2026-01': [
    {
      sessionId: 1001,
      startTime: '2026-01-09T08:30:00.000Z',
      endTime: '2026-01-09T11:00:00.000Z',
      totalDistance: 6.5,
    },
    {
      sessionId: 1002,
      startTime: '2026-01-09T19:30:00.000Z',
      endTime: '2026-01-09T21:00:00.000Z',
      totalDistance: 4.8,
    },
    {
      sessionId: 1003,
      startTime: '2026-01-05T18:00:00.000Z',
      endTime: '2026-01-05T19:00:00.000Z',
      totalDistance: 3.2,
    },
  ],
  // 2025-12월 데이터
  '2025-12': [
    {
      sessionId: 2001,
      startTime: '2025-12-21T09:10:00.000Z',
      endTime: '2025-12-21T10:20:00.000Z',
      totalDistance: 5.9,
    },
    {
      sessionId: 2002,
      startTime: '2025-12-12T18:45:00.000Z',
      endTime: '2025-12-12T20:05:00.000Z',
      totalDistance: 4.1,
    },
  ],
  // 2025-11월 데이터
  '2025-11': [
    {
      sessionId: 3001,
      startTime: '2025-11-09T08:30:00.000Z',
      endTime: '2025-11-09T11:00:00.000Z',
      totalDistance: 6.5,
    },
    {
      sessionId: 3002,
      startTime: '2025-11-09T19:30:00.000Z',
      endTime: '2025-11-09T21:00:00.000Z',
      totalDistance: 4.8,
    },
    {
      sessionId: 3003,
      startTime: '2025-11-05T18:00:00.000Z',
      endTime: '2025-11-05T19:00:00.000Z',
      totalDistance: 3.2,
    },
  ],
};
