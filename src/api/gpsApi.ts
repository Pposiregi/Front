import apiClient from './httpClient';
import type {
  GpsEndRequest,
  GpsEndResponse,
  GpsLogRequest,
  GpsLogResponse,
  GpsSessionStartRequest,
  GpsSessionStartResponse,
} from 'types/gps';

const toLogString = (payload: unknown) => {
  try {
    return JSON.stringify(payload);
  } catch {
    return String(payload);
  }
};

/**
 * GPS 세션 시작
 */
export const startGpsSession = async (
  payload: GpsSessionStartRequest
): Promise<GpsSessionStartResponse> => {
  if (__DEV__) {
    console.log(
      '>>>[RUNNING][API] /gps/start request ' + toLogString({ ...payload })
    );
  }
  const { data } = await apiClient.post<GpsSessionStartResponse>('/gps/start', {
    ...payload,
  });
  if (__DEV__) {
    console.log('>>>[RUNNING][API] /gps/start response ' + toLogString(data));
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
    console.log(
      '>>>[RUNNING][API] /gps/log request ' + toLogString({ ...payload })
    );
  }
  const { data } = await apiClient.post<GpsLogResponse>('/gps/log', {
    ...payload,
  });
  if (__DEV__) {
    console.log('>>>[RUNNING][API] /gps/log response ' + toLogString(data));
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
    console.log(
      '>>>[RUNNING][API] /gps/end request ' + toLogString({ ...payload })
    );
  }
  const { data } = await apiClient.post<GpsEndResponse>('/gps/end', {
    ...payload,
  });
  if (__DEV__) {
    console.log('>>>[RUNNING][API] /gps/end response ' + toLogString(data));
  }
  return data;
};
