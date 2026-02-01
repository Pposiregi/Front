import { SessionDetail } from '@pages/activity/activityDetail/types';
import { DailyActivity, GPS_SESSION, WeeklyStepItem } from '../types/activity';
import apiClient from './httpClient';

export const getWeeklySteps = async (): Promise<WeeklyStepItem[]> => {
  const { data } = await apiClient.get<WeeklyStepItem[]>(
    `/daily/walks/steps/weekly`
  );
  return data;
};

export const getDailyActivity = async (
  date: string
): Promise<DailyActivity> => {
  const { data } = await apiClient.get<DailyActivity>('/report/activity/daily', {
    params: { date },
  });
  return data;
};

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

export const getMonthlySessions = async (
  year: number,
  month: number
): Promise<GPS_SESSION[]> => {
  const { data } = await apiClient.get('/gps/sessions', {
    params: { year, month },
  });
  return data;
};

export const getSessionDetail = async (
  sessionId: string | number
): Promise<SessionDetail> => {
  const { data } = await apiClient.get<SessionDetail>(
    `/gps/sessions/${sessionId}`
  );
  return data;
};
