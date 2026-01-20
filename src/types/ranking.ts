/**
 * 걸음 수 기준 유저 랭킹 조회 요청 타입
 */
export type GetDailyStepRankingRequest = {
  limit: number;
  gender: 'ALL' | 'MALE' | 'FEMALE';
};

/**
 * 걸음 수 기준 유저 랭킹 조회 응답 타입
 */
export interface DailyStepRankingResponse {
  top10: DailyStepRankingItem[];
  myRank: number;
}

/**
 * 걸음 수 기준 유저 랭킹 조회 응답 아이템
 */
export type DailyStepRankingItem = {
  userId: number;
  nickname: string;
  dailyStepCount: number;
};
