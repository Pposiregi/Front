export type SocialPlatform = 'kakao' | 'google';

export type GetSocialLoginPlatformRequest = {
  idToken: string;
  accessToken: string;
  platform: SocialPlatform;
};

export type RegistrationStatus = 'INCOMPLETE' | 'COMPLETE';

export type SocialLoginApiResponse = {
  success: true;
  registrationStatus: RegistrationStatus;
  serverAccessToken: string;
};

export type SocialLoginResponse = {
  success: true;
  registrationStatus: string;
  serverAccessToken: string;
};
