import apiClient from './httpClient';
import type {
  GetDailyStepRankingRequest,
  DailyStepRankingApiResponse,
  DailyStepRankingApiItem,
  DailyStepRankingResponse,
  DailyStepRankingItem,
} from 'types/ranking';

const normalizeRankingItem = (
  item: DailyStepRankingApiItem
): DailyStepRankingItem => ({
  userId: item.userId,
  nickname: item.nickname,
  dailyStepCount: item.dailyStepCount,
});

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

  const { data } = await apiClient.get<DailyStepRankingApiResponse>(url, {
    params,
  });

  if (!data || !Array.isArray(data.top10)) {
    throw new Error('부정확한 랭킹 데이터.');
  }

  return {
    top10: data.top10.map(normalizeRankingItem),
    myRank: data.myRank,
  };
};
