import EncryptedStorage from 'react-native-encrypted-storage';
import { authRequest, authResponse } from '../types/auth';
import apiClient from './httpClient';

export const signUp = async (
  formData: authRequest
): Promise<authResponse | null> => {
  try {
    const response = await apiClient.patch<authResponse>(
      `/users/signUp/complete`,
      formData
    );
    return response.data;
  } catch (err) {
    console.error('[Auth] 회원가입 완료 실패', err);
    return null;
  }
};

export const refreshAccessToken = async (): Promise<{
  serverAccessToken: string;
  registrationStatus: 'INCOMPLETE' | 'COMPLETE';
} | null> => {
  try {
    const refreshToken = await EncryptedStorage.getItem('refreshToken');

    if (!refreshToken) throw new Error('refreshToken 없음');
    const response = await apiClient.post<{
      serverAccessToken: string;
      registrationStatus: 'INCOMPLETE' | 'COMPLETE';
    }>(
      '/auth/refresh',
      {},
      {
        headers: {
          Authorization: `Bearer ${refreshToken}`,
        },
      }
    );
    return response.data;
  } catch (err) {
    console.error('[Auth] accessToken 갱신 실패', err);
    return null;
  }
};
