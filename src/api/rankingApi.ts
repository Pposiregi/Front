import apiClient from './httpClient';
import type {
  GetDailyStepRankingRequest,
  DailyStepRankingResponse,
} from 'types/ranking';

export const getDailyStepRanking = async ({
  gender = 'ALL',
}: GetDailyStepRankingRequest): Promise<DailyStepRankingResponse> => {
  let url = '/ranking/summary';
  const params: any = {};

  // 남/여 필터 API 새로 수정되면 그거 가져다가 쓸 것
  if (gender === 'MALE') {
    url = '/users/rankings/daily-step/gender';
    params.gender = 'male';
  } else if (gender === 'FEMALE') {
    url = '/users/rankings/daily-step/gender';
    params.gender = 'female';
  }

  const { data } = await apiClient.get<DailyStepRankingResponse>(url, {
    params,
  });

  if (!data || !Array.isArray(data.topRankings)) {
    throw new Error('부정확한 랭킹 데이터.');
  }

  return {
    topRankings: data.topRankings,
    myRanking: data.myRanking,
  };
};
