import { WeeklyStepItem } from '../types/activity';
import apiClient from './httpClient';

export const getWeeklySteps = async () => {
  const { data } = await apiClient.get<WeeklyStepItem[]>(
    `/daily/walks/steps/weekly`
  );
  console.log('>>>> getWeeklySteps api data :', data);
  return data;
};
