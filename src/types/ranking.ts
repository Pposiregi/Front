/**
 * 걸음 수 기준 유저 랭킹 조회 요청 타입
 */
export type GetDailyStepRankingRequest = {
  gender: 'ALL' | 'MALE' | 'FEMALE';
};

/**
 * 걸음 수 기준 유저 랭킹 조회 응답 타입
 */
export interface DailyStepRankingResponse {
  topRankings: DailyStepRankingItem[];
  myRanking: DailyStepRankingItem | null;
}
/**
 * 걸음 수 기준 유저 랭킹 조회 응답 아이템
 */
export interface DailyStepRankingItem {
  userId: number;
  nickname: string;
  score: number; // 걸음 수
  rank: number;
}
