import apiClient from './httpClient';

/***
 * PUSH용 TOKEN 관리 API
 */

export type PushTokenPayload = {
  deviceUuid: string;
  deviceToken: string;
  deviceOs: 'ANDROID'; // ANDROID 고정
};

export const postPushToken = async (
  payload: PushTokenPayload,
  accessToken: string,
  userId: number
) => {
  const { data } = await apiClient.post('/devices/push-token', payload, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    params: { userId },
  });
  return data;
};
