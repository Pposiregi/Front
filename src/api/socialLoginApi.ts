import {
  GetSocialLoginPlatformRequest,
  SocialLoginApiResponse,
  SocialLoginResponse,
} from 'types/socialLogin';
import apiClient from './httpClient';

export const getSocialLogin = async ({
  idToken,
  accessToken,
  platform,
}: GetSocialLoginPlatformRequest): Promise<SocialLoginResponse> => {
  const url = `/auth/oauth/${platform}`;
  // 플랫폼에 따라 body 분기
  let body: any = {};

  if (platform === 'google') {
    body.idToken = idToken;
  }

  if (platform === 'kakao') {
    body.accessToken = accessToken;
  }
  const { data } = await apiClient.post<SocialLoginApiResponse>(url, body);
  return data;
};
