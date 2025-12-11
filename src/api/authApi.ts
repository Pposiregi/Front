import { authRequest, authResponse } from '../types/auth';
import apiClient from './httpClient';

export const signUp = async (formData: authRequest) => {
  const { data } = await apiClient.patch<authResponse>(
    `/users/signUp/complete`,
    formData
  );
  return data;
};
