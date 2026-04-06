import { petsRequest, petsResponse } from 'types/pet';
import apiClient from './httpClient';

export const postPets = async (body: petsRequest): Promise<petsResponse> => {
  const { data } = await apiClient.post<petsResponse>('/pets', body);
  return data;
};
