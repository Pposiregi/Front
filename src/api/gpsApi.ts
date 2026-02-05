import apiClient from './httpClient';
import type {
  GpsEndRequest,
  GpsEndResponse,
  GpsLogRequest,
  GpsLogResponse,
  GpsSessionStartRequest,
  GpsSessionStartResponse,
} from 'types/gps';

/**
 * GPS 세션 시작
 * - TODO: 임시 userId 전송 제거(토큰 식별 전제)
 */
export const startGpsSession = async (
  payload: GpsSessionStartRequest
): Promise<GpsSessionStartResponse> => {
  if (__DEV__) {
    console.log('>>>[RUNNING][API] /gps/start request', {
      ...payload,
      userId: 1,
    });
  }
  const { data } = await apiClient.post<GpsSessionStartResponse>('/gps/start', {
    ...payload,
    userId: 1,
  });
  if (__DEV__) {
    console.log('>>>[RUNNING][API] /gps/start response', data);
  }
  return data;
};

/**
 * GPS 로그 전송
 */
export const logGps = async (
  payload: GpsLogRequest
): Promise<GpsLogResponse> => {
  if (__DEV__) {
    console.log('>>>[RUNNING][API] /gps/log request', {
      ...payload,
      userId: 1,
    });
  }
  const { data } = await apiClient.post<GpsLogResponse>('/gps/log', {
    ...payload,
    userId: 1,
  });
  if (__DEV__) {
    console.log('>>>[RUNNING][API] /gps/log response', data);
  }
  return data;
};

/**
 * GPS 세션 종료
 */
export const endGpsSession = async (
  payload: GpsEndRequest
): Promise<GpsEndResponse> => {
  if (__DEV__) {
    console.log('>>>[RUNNING][API] /gps/end request', {
      ...payload,
      userId: 1,
    });
  }
  const { data } = await apiClient.post<GpsEndResponse>('/gps/end', {
    ...payload,
    userId: 1,
  });
  if (__DEV__) {
    console.log('>>>[RUNNING][API] /gps/end response', data);
  }
  return data;
};
