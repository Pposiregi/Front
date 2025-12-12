import EncryptedStorage from 'react-native-encrypted-storage';
import { authRequest, authResponse } from '../types/auth';
import apiClient from './httpClient';

export const signUp = async (formData: authRequest) => {
  try {
    console.log('이게 포장이묹넨가', formData);
    const response = await apiClient.patch<authResponse>(
      `/users/signUp/complete`,
      formData
    );
    console.log('>>>>> signUpApi response : ', response);
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
    console.log('흠 여기가없나', refreshToken);
    [];

    if (!refreshToken) throw new Error('refreshToken 없음');
    const response = await apiClient.post<{
      serverAccessToken: string;
      registrationStatus: 'INCOMPLETE' | 'COMPLETE';
    }>(
      '/auth/refresh',
      {},
      {
        headers: {
          Cookie: `REFRESH_TOKEN=${refreshToken}`,
        },
        withCredentials: true,
      }
    );
    console.log('>>>>> refreshAccessToken response : ', response);
    return response.data;
  } catch (err) {
    console.error('[Auth] accessToken 갱신 실패', err);
    return null;
  }
};
