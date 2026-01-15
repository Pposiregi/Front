export type GetDailyStepRankingRequest = {
  limit: number;
  gender: 'ALL' | 'MALE' | 'FEMALE';
};

export type DailyStepRankingApiItem = {
  userId: number;
  nickname: string;
  dailyStepCount: number;
};

export type DailyStepRankingItem = {
  userId: number;
  nickname: string;
  dailyStepCount: number;
};

export interface DailyStepRankingApiResponse {
  top10: DailyStepRankingApiItem[];
  myRank: number;
}

export interface DailyStepRankingResponse {
  top10: DailyStepRankingItem[];
  myRank: number;
}
