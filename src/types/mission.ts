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
  mission_check_id: number;
  mission_id: number;
  title: string;
  category: MissionCategory;
  period_type: MissionPeriodType;
  period_start: string;
  period_end: string;
  goal_value: number;
  progress_value: number;
  is_completed: boolean;
  completed_at: string | null;
}

export interface MissionResponse {
  missions: MissionItem[];
}
