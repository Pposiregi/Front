import apiClient from './httpClient';
import type {
  GetDailyStepRankingRequest,
  DailyStepRankingResponse,
} from 'types/ranking';

export const getDailyStepRanking = async ({
  limit = 10,
  gender = 'ALL',
}: GetDailyStepRankingRequest): Promise<DailyStepRankingResponse> => {
  let url = '/users/rankings/daily-step';
  const params: any = { limit };

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

  if (!data || !Array.isArray(data.top10)) {
    throw new Error('부정확한 랭킹 데이터.');
  }

  return {
    top10: data.top10,
    myRank: data.myRank,
  };
};
