import apiClient from './httpClient';
import {
  MissionHistoryResponse,
  MissionActiveResponse,
  MissionCompleteResponse,
} from 'types/mission';

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

export const postMissionComplete = async (
  missionCheckId: number
): Promise<MissionCompleteResponse> => {
  const { data } = await apiClient.post<MissionCompleteResponse>(
    `/missions/checks/${missionCheckId}/complete`
  );
  console.log('데이터보여주세요', data);
  return data;
};
