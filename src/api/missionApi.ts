import apiClient from './httpClient';
import {
  MissionHistoryResponse,
  MissionActiveResponse,
  MissionProgressResponse,
  MissionProgressRequest,
} from 'types/mission';

/**
 * @param payload
 * @returns
 */

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

export const postMissionsStep = async (
  payload: MissionProgressRequest
): Promise<MissionProgressResponse> => {
  const { data } = await apiClient.post('/missions/progress/step', payload);
  return data;
};
