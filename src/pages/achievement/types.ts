import { ImageSourcePropType } from 'react-native';

export type Badge = {
  badgeId: number;
  title: string;
  type: 'STEP' | 'RUN' | 'MISSION' | 'ATTENDANCE' | 'EAT_KCAL';
  tier: 'BRONZE' | 'SILVER' | 'GOLD';
  iconUrl: ImageSourcePropType;
  createdAt: string;
};
