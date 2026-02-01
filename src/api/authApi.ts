import EncryptedStorage from 'react-native-encrypted-storage';
import { authRequest, authResponse } from '../types/auth';
import apiClient from './httpClient';

/**
 * 회원가입 완료(추가 정보 저장) 요청.
 * - 성공 시 authResponse 반환, 실패 시 null 반환.
 */
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

/**
 * refreshToken으로 accessToken을 갱신한다.
 * - 토큰이 없거나 갱신 실패 시 에러를 throw한다.
 */
export const refreshAccessToken = async (): Promise<{
  serverAccessToken: string;
  registrationStatus: 'INCOMPLETE' | 'COMPLETE';
}> => {
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
    throw err;
  }
};
