import apiClient from './httpClient';
import {
  MissionHistoryResponse,
  MissionActiveResponse,
  MissionProgressResponse,
} from '../types/mission';

export const getMissionHistory = async (): Promise<MissionHistoryResponse> => {
  const { data } = await apiClient.get<MissionHistoryResponse>(
    '/missions/history'
  );
  return data;
};

export const getMissionsActive = async (): Promise<MissionActiveResponse> => {
  const { data } = await apiClient.get<MissionActiveResponse>(
    '/missions/active'
  );
  return data;
};

export const postMissionsPhoto = async (): Promise<MissionProgressResponse> => {
  const { data } = await apiClient.post('/missions/progress/photo');
  return data;
};
