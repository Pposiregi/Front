import apiClient from './httpClient';
import {
  MissionHistoryResponse,
  MissionActiveResponse,
  MissionCompleteResponse,
} from 'types/mission';
import { mockActiveMissions } from '@pages/main/mockMission';

const MISSION_ACTIVE_TIMEOUT_MS = 5000;

const timeoutAfter = <T>(ms: number): Promise<T> =>
  new Promise((_, reject) => {
    setTimeout(() => reject(new Error('MISSIONS_ACTIVE_TIMEOUT')), ms);
  });

export const getMissionHistory = async (): Promise<MissionHistoryResponse> => {
  const { data } = await apiClient.get<MissionHistoryResponse>(
    '/missions/history'
  );
  return data;
};

export const getMissionsActive = async (): Promise<MissionActiveResponse> => {
  try {
    const { data } = await Promise.race([
      apiClient.get<MissionActiveResponse>('/missions/active'),
      timeoutAfter<Awaited<
        ReturnType<typeof apiClient.get<MissionActiveResponse>>
      >>(MISSION_ACTIVE_TIMEOUT_MS),
    ]);
    return data;
  } catch (error) {
    console.warn(
      `[MissionApi] active missions 응답 실패 또는 ${MISSION_ACTIVE_TIMEOUT_MS}ms 초과로 mock 데이터를 사용합니다.`,
      error
    );
    return mockActiveMissions;
  }
};

export const postMissionComplete = async (
  missionCheckId: number
): Promise<MissionCompleteResponse> => {
  const { data } = await apiClient.post<MissionCompleteResponse>(
    `/missions/checks/${missionCheckId}/complete`
  );
  return data;
};
