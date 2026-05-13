import apiClient from './httpClient';
import {
  DailyWalkRequest,
  DailyWalkResponse,
  getUserResponse,
} from 'types/main';

const GET_USER_TIMEOUT_MS = 5000;
const GET_USER_TIMEOUT_ERROR = 'GET_USER_TIMEOUT';

const MOCK_USER_RESPONSE: getUserResponse = {
  userId: 1,
  email: 'dev@fitpet.local',
  nickname: 'DEV',
  petType: 'CAT',
  age: 28,
  gender: null,
  weightKg: 65,
  targetWeightKg: 62,
  heightCm: 170,
  pbf: 22,
  targetPbf: 20,
  targetStepCount: 8000,
  dailyStepCount: 3200,
  profileImageUrl: '',
  pet: {
    petId: 1,
    name: '피트',
    petType: 'CAT',
    color: 'BASIC',
    exp: 0,
    expression: 'HAPPY',
  },
};

const timeoutAfter = <T>(ms: number): Promise<T> =>
  new Promise((_, reject) => {
    setTimeout(() => reject(new Error(GET_USER_TIMEOUT_ERROR)), ms);
  });

/**
 * User 정보 가져오기
 */
export const getUser = async (): Promise<getUserResponse> => {
  try {
    const { data } = await Promise.race([
      apiClient.get<getUserResponse>('users'),
      timeoutAfter<Awaited<ReturnType<typeof apiClient.get<getUserResponse>>>>(
        GET_USER_TIMEOUT_MS
      ),
    ]);
    return data;
  } catch (error) {
    if ((error as Error)?.message === GET_USER_TIMEOUT_ERROR) {
      console.warn(
        `[MainApi] users 응답이 ${GET_USER_TIMEOUT_MS}ms 동안 없어 mock 데이터를 사용합니다.`
      );
      return MOCK_USER_RESPONSE;
    }

    console.error('[MainApi] users 요청 실패', error);
    throw error;
  }
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
