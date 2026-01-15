import apiClient from './httpClient';

/***
 * PUSH용 TOKEN 관리 API
 */

export type PushTokenPayload = {
  deviceUuid: string;
  deviceToken: string;
  deviceOs: 'ANDROID'; // ANDROID 고정
};

export type PushTokenDeletePayload = {
  deviceUuid: string;
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

export const patchPushToken = async (
  payload: PushTokenPayload,
  accessToken: string,
  userId: number
) => {
  const { data } = await apiClient.patch('/devices/push-token', payload, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    params: { userId },
  });
  return data;
};

export const deletePushToken = async (
  payload: PushTokenDeletePayload,
  accessToken: string,
  userId: number
) => {
  const { data } = await apiClient.delete('/devices/push-token', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    params: { userId },
    data: payload,
  });
  return data;
};
