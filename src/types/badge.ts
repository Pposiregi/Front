export interface Badge {
  badgeId: number;
  title: string;
  type: 'STEP' | 'MEAL';
  conditionDuration: number | null;
  conditionGoal: number;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserBadge {
  badgeCheckId: number;
  userId: number;
  badgeId: number;
  createdAt: string;
  updatedAt: string;
}
