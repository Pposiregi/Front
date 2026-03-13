import { SessionDetail } from '@pages/activity/activityDetail/types';
import { DailyActivity, GPS_SESSION, WeeklyStepItem } from '../types/activity';
import apiClient from './httpClient';

export const getWeeklySteps = async (): Promise<WeeklyStepItem[]> => {
  const { data } = await apiClient.get<WeeklyStepItem[]>(
    `/daily/walks/steps/weekly`
  );
  return data;
};

/**
 * 특정 날짜의 일일 활동 요약 조회
 * - steps, distanceKm, burnCalories를 반환한다.
 */
export const getDailyActivity = async (
  date: string
): Promise<DailyActivity> => {
  const { data } = await apiClient.get<DailyActivity>(
    '/report/activity/today',
    {
      params: { date },
    }
  );
  return data;
};

/**
 * 날짜 범위 내 일일 활동 요약 리스트 조회
 * - 월간 리스트(일별 탭)용 데이터
 */
export const getActivityRange = async (
  from: string,
  to: string
): Promise<DailyActivity[]> => {
  const { data } = await apiClient.get<DailyActivity[]>(
    '/report/activity/range',
    {
      params: { from, to },
    }
  );
  return data;
};

/**
 * 월간 GPS 세션 목록 조회
 */
export const getMonthlySessions = async (
  year: number,
  month: number
): Promise<GPS_SESSION[]> => {
  const { data } = await apiClient.get('/gps/sessions', {
    params: { year, month },
  });
  return data;
};

/**
 * GPS 세션 상세 정보 조회
 */
export const getSessionDetail = async (
  sessionId: string | number
): Promise<SessionDetail> => {
  const { data } = await apiClient.get<SessionDetail>(
    `/gps/sessions/${sessionId}`
  );
  return data;
};
