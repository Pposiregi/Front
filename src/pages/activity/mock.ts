import { GPS_SESSION } from '../../types/activity';

export const getDateString = (daysAgo: number): string => {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  return date.toISOString().split('T')[0];
};

// 월별 활동 기록을 시뮬레이션하기 위한 목업 데이터
// 2025년 11월과 10월 데이터를 가정
export const mock_data_by_month: { [key: string]: GPS_SESSION[] } = {
  // 2025-11월 데이터
  '2025-11': [
    {
      session_id: 'S_AM_0830',
      start_time: '2025-11-09T08:30:00.000Z',
      end_time: '2025-11-09T11:00:00.000Z',
      total_distance: 6.5,
    },
    {
      session_id: 'S_PM_1930',
      start_time: '2025-11-09T19:30:00.000Z',
      end_time: '2025-11-09T21:00:00.000Z',
      total_distance: 4.8,
    },
    {
      session_id: 'S_PM_1934',
      start_time: '2025-11-05T18:00:00.000Z',
      end_time: '2025-11-05T19:00:00.000Z',
      total_distance: 3.2,
    },
  ],
  // 2025-10월 데이터
  '2025-10': [
    {
      session_id: 'S_AM_0832',
      start_time: '2025-10-25T10:00:00.000Z',
      end_time: '2025-10-25T12:00:00.000Z',
      total_distance: 7.9,
    },
    {
      session_id: 'S_PM_1932',
      start_time: '2025-10-10T07:00:00.000Z',
      end_time: '2025-10-10T08:30:00.000Z',
      total_distance: 5.5,
    },
  ],
};
