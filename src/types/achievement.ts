// 미션 API
export type MissionCategory = 'STEP' | 'MEAL';
export type MissionPeriodType = 'DAILY' | 'WEEKLY' | 'MONTHLY';

export interface MissionHistoryItem {
  mission_check_id: number;
  mission_id: number;
  title: string;
  category: MissionCategory;
  period_type: MissionPeriodType;
  period_start: string;
  period_end: string;
  goal_value: number;
  progress_value: number;
  completed_at: string | null;
}

export interface MissionHistoryResponse {
  missions: MissionHistoryItem[];
}
