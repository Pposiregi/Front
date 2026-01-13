import apiClient from './httpClient';
import {
  MissionHistoryResponse,
  MissionCheckItem,
  MissionActiveResponse,
  MissionProgressResponse,
} from '../types/mission';

export const getMissionHistory = async (): Promise<MissionHistoryResponse> => {
  const { data } = await apiClient.get<MissionHistoryResponse>(
    '/missions/history'
  );
  console.log('>>>> getMissionHistory api data :', data);
  return data;
};

export const getMissionsActive = async (): Promise<MissionActiveResponse> => {
  const { data } = await apiClient.get<MissionActiveResponse>(
    '/missions/active'
  );
  console.log('>>>> getMissionsActive api data :', data);
  return data;
};

export const postMissionsPhoto = async (): Promise<MissionProgressResponse> => {
  const { data } = await apiClient.post('/missions/progress/photo');
  console.log('>>>> postMissionsPhoto api data :', data);
  return data;
};
