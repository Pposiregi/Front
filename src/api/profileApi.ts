import apiClient from './httpClient';
import type { PetUpdateRequest, UserUpdateRequest } from 'types/profile';

export const updateUserProfile = async (
  userId: number,
  payload: UserUpdateRequest
) => {
  const { data } = await apiClient.patch('/users', payload, {
    params: { userId },
  });
  return data;
};

export const updateUserInputInfo = async (
  userId: number,
  payload: UserUpdateRequest
) => {
  const { data } = await apiClient.patch('/users/signUp/complete', payload, {
    params: { userId },
  });
  return data;
};

export const updatePetProfile = async (
  userId: number,
  petId: number,
  payload: PetUpdateRequest
) => {
  const { data } = await apiClient.patch(`/pets/${petId}`, payload, {
    params: { userId },
  });
  return data;
};
