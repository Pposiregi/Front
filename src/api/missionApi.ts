import apiClient from './httpClient';
import { MissionHistoryResponse, MissionActiveResponse } from 'types/mission';

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
