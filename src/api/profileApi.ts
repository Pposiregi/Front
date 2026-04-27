import apiClient from './httpClient';
import type {
  PetUpdateRequest,
  ProfileImageHistoryItem,
  ProfileImageUploadResponse,
  UserUpdateRequest,
} from 'types/profile';
import type { getUserResponse } from 'types/main';

export const updateUserProfile = async (payload: UserUpdateRequest): Promise<getUserResponse> => {
  const { data } = await apiClient.patch('/users', payload);
  return data;
};

export const getProfileImageHistory = async (): Promise<ProfileImageHistoryItem[]> => {
  const { data } = await apiClient.get('/users/profile-image/history');
  return data;
};

export const updateUserInputInfo = async (payload: UserUpdateRequest) => {
  const { data } = await apiClient.patch('/users/signUp/complete', payload);
  return data;
};

export const updatePetProfile = async (
  petId: number,
  payload: PetUpdateRequest
) => {
  const { data } = await apiClient.patch(`/pets/${petId}`, payload);
  return data;
};

export const requestProfileImageUpload =
  async (): Promise<ProfileImageUploadResponse> => {
    const { data } = await apiClient.post('/users/profile-image');
    return data;
  };
