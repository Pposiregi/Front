import {
  GetSocialLoginPlatformRequest,
  SocialLoginApiResponse,
  SocialLoginResponse,
} from 'types/socialLogin';
import apiClient from './httpClient';
import EncryptedStorage from 'react-native-encrypted-storage';

export const getSocialLogin = async ({
  idToken,
  accessToken,
  platform,
}: GetSocialLoginPlatformRequest): Promise<SocialLoginResponse> => {
  const url = `/auth/oauth/${platform}`;
  let body: any = {};

  if (platform === 'google') {
    body.idToken = idToken;
  }
  if (platform === 'kakao') {
    body.accessToken = accessToken;
  }

  try {
    const response = await apiClient.post<SocialLoginApiResponse>(url, body);

    const setCookieHeader = response.headers['set-cookie'];

    if (setCookieHeader) {
      // 예: "refreshToken=abcd1234; Path=/; HttpOnly; Secure"
      const cookieString = Array.isArray(setCookieHeader)
        ? setCookieHeader.join(';')
        : setCookieHeader;
      const match = cookieString.match(/REFRESH_TOKEN=([^;]+)/);
      if (match) {
        const refreshToken = match[1];
        await EncryptedStorage.setItem('refreshToken', refreshToken);
        console.log('refreshToken 이거 해보자', refreshToken);
      }
    } else {
      console.log('Set-Cookie 헤더가 응답에 없습니다.');
    }
    return response.data;
  } catch (error) {
    console.error('소셜 로그인 요청 실패:');
    throw error;
  }
};
