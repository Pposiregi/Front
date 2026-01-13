// get missions/history
export type MissionCategory = 'STEP' | 'MEAL';
export type MissionPeriodType = 'DAILY' | 'WEEKLY' | 'MONTHLY';

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

// get missions
export interface MissionItem {
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

export interface MissionResponse {
  missions: MissionItem[];
}
