import { MissionProgressResponse } from 'types/mission';
import apiClient from './httpClient';
import { DailyWalkRequest, getUserResponse } from 'types/main';

/**
 * User 정보 가져오기
 */
export const getUser = async (): Promise<getUserResponse> => {
  const { data } = await apiClient.get('users');
  return data;
};

/**
 * healtConnect에서 일정 걸음 이상 수집하면 전송 (현재 1000걸음)
 */
export const postDailyWalks = async (
  payload: DailyWalkRequest
): Promise<MissionProgressResponse> => {
  const { data } = await apiClient.post('/daily/walks', payload);
  return data;
};
