import { SessionDetail } from '@pages/activity/activityDetail/types';
import { GPS_SESSION, WeeklyStepItem } from '../types/activity';
import apiClient from './httpClient';

export const getWeeklySteps = async (): Promise<WeeklyStepItem[]> => {
  const { data } = await apiClient.get<WeeklyStepItem[]>(
    `/daily/walks/steps/weekly`
  );
  console.log('>>>> getWeeklySteps api data :', data);
  return data;
};

export const getMonthlySessions = async (
  year: number,
  month: number
): Promise<GPS_SESSION[]> => {
  const { data } = await apiClient.get('/gps/sessions', {
    params: { year, month },
  });
  console.log('>>>> getMonthlySessions api data :', data);
  return data;
};

export const getSessionDetail = async (
  sessionId: string | number
): Promise<SessionDetail> => {
  const { data } = await apiClient.get<SessionDetail>(
    `/gps/sessions/${sessionId}`
  );
  console.log('>>>> getSessionDetail api data :', data);
  return data;
};
