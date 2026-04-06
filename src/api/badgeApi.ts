import { Badge, UserBadge } from '../types/badge';
import apiClient from './httpClient';

export const getBadges = async (): Promise<Badge[]> => {
  const { data } = await apiClient.get<Badge[]>(`/badges`);
  return data;
};

export const getUserBadges = async (): Promise<UserBadge[]> => {
  const { data } = await apiClient.get<UserBadge[]>('/badges/users');
  return data;
};
