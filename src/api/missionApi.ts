import apiClient from './httpClient';
import { MissionResponse, MissionHistoryResponse } from '../types/mission';

export const getMissionHistory = async (): Promise<MissionHistoryResponse> => {
  const { data } = await apiClient.get<MissionHistoryResponse>(
    '/missions/history'
  );
  console.log('>>>> getMissionHistory api data :', data);
  return data;
};

export const getMissionss = async (): Promise<MissionResponse> => {
  const { data } = await apiClient.get<MissionResponse>('/missions/active');
  console.log('>>>> getMissions api data :', data);
  return data;
};

export const postMissionsPhoto = async (): Promise<void> => {
  const { data } = await apiClient.post('/missions/progress/photo');
};
