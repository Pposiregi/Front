import apiClient from './httpClient';
import {
  DailyWalkRequest,
  DailyWalkResponse,
  getUserResponse,
} from 'types/main';

/**
 * User 정보 가져오기
 */
export const getUser = async (): Promise<getUserResponse> => {
  const { data } = await apiClient.get<getUserResponse>('users');
  return data;
};

/**
 * healtConnect에서 일정 걸음 이상 수집하면 전송 (현재 1000걸음)
 */
export const postDailyWalks = async (
  payload: DailyWalkRequest
): Promise<DailyWalkResponse> => {
  const { data } = await apiClient.post<DailyWalkResponse>(
    '/daily/walks',
    payload
  );
  return data;
};
