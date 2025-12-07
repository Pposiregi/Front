import { ImageSourcePropType } from 'react-native';

export type Badge = {
  badgeId: number;
  title: string;
  type: 'STEP' | 'RUN' | 'MISSION' | 'ATTENDANCE' | 'EAT_KCAL';
  tier: 'BRONZE' | 'SILVER' | 'GOLD';
  iconUrl: ImageSourcePropType;
  createdAt: string;
};

export type MissionData = {
  missionId: number;
  title: string;
  progress: number; // 0~100
}[];

export type RankingItem = {
  userId: number;
  nickname: string;
  dailyStepCount: number;
};

export type RankingData = {
  top10: RankingItem[];
  myRank: number;
};
