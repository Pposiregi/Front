import apiClient from './httpClient';
import type {
  GetDailyStepRankingRequest,
  DailyStepRankingResponse,
} from 'types/ranking';

export const getDailyStepRanking = async ({
  gender = 'ALL',
}: GetDailyStepRankingRequest): Promise<DailyStepRankingResponse> => {
  const params = {
    filter: gender.toUpperCase(),
  };

  const { data } = await apiClient.get<DailyStepRankingResponse>(
    '/ranking/summary',
    { params }
  );

  if (!data || !Array.isArray(data.topRankings)) {
    throw new Error('부정확한 랭킹 데이터.');
  }

  return {
    topRankings: data.topRankings,
    myRanking: data.myRanking,
  };
};
