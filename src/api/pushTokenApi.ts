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
  accessToken: string
) => {
  const { data } = await apiClient.post('/devices/push-token', payload, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return data;
};

export const patchPushToken = async (
  payload: PushTokenPayload,
  accessToken: string
) => {
  const { data } = await apiClient.patch('/devices/push-token', payload, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return data;
};

export const deletePushToken = async (
  payload: PushTokenDeletePayload,
  accessToken: string
) => {
  const { data } = await apiClient.delete('/devices/push-token', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    data: payload,
  });
  return data;
};
