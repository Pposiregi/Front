import apiClient from './httpClient';
import { MissionHistoryResponse } from '../types/achievement';

export const getMissionHistory = async (): Promise<MissionHistoryResponse> => {
  const { data } = await apiClient.get<MissionHistoryResponse>(
    '/api/missions/history'
  );
  console.log('>>>> getMissionHistory api data :', data);
  return data;
};
