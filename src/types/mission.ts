/**
 * 공통 Enum
 */

export type MissionCategory = 'STEP' | 'MEAL';
export type MissionPeriodType = 'DAILY' | 'WEEKLY' | 'MONTHLY';

/**
 * 완료된 미션 이력 조회 (History)
 */
export interface MissionHistoryItem {
  missionCheckId: number;
  missionId: number;
  title: string;
  category: MissionCategory;
  periodType: MissionPeriodType;
  periodStart: string;
  periodEnd: string;
  goalValue: number;
  progressValue: number;
  completed: boolean;
  completedAt: string | null;
}

export interface MissionHistoryResponse {
  missions: MissionHistoryItem[];
}

/**
 * 현재 진행 중인 미션 (Active)
 */
export interface MissionActiveItem {
  missionCheckId: number;
  missionId: number;
  title: string;
  category: MissionCategory;
  periodType: MissionPeriodType;
  periodStart: string;
  periodEnd: string;
  goalValue: number;
  progressValue: number;
  isCompleted: boolean;
  completedAt: string | null;
}

export interface MissionActiveResponse {
  missions: MissionActiveItem[];
}

/**
 * 미션 완료 응답 타입
 */
export interface MissionCompleteResponse {
  missionCheckId: number;
  missionId: number;
  userId: number;
  completed: boolean;
  progressValue: number;
  periodType: MissionPeriodType;
  periodStart: string;
  periodEnd: string;
  completedAt: string;
  createdAt: string;
  updatedAt: string;
}
