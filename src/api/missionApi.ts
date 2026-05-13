import apiClient from './httpClient';
import {
  MissionHistoryResponse,
  MissionActiveResponse,
  MissionCompleteResponse,
} from 'types/mission';
import { mockActiveMissions } from '@pages/main/mockMission';

const MISSION_ACTIVE_TIMEOUT_MS = 5000;
const MISSION_ACTIVE_TIMEOUT_ERROR = 'MISSIONS_ACTIVE_TIMEOUT';

const timeoutAfter = <T>(ms: number): Promise<T> =>
  new Promise((_, reject) => {
    setTimeout(() => reject(new Error(MISSION_ACTIVE_TIMEOUT_ERROR)), ms);
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
    if ((error as Error)?.message === MISSION_ACTIVE_TIMEOUT_ERROR) {
      if (__DEV__) {
        console.warn(
          `[MissionApi] active missions 응답이 ${MISSION_ACTIVE_TIMEOUT_MS}ms 동안 없어 mock 데이터를 사용합니다.`
        );
        return mockActiveMissions;
      }

      console.error(
        `[MissionApi] active missions 응답이 ${MISSION_ACTIVE_TIMEOUT_MS}ms 동안 없어 요청을 중단합니다.`,
        error
      );
      throw error;
    }

    console.error('[MissionApi] active missions 요청 실패', error);
    throw error;
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
