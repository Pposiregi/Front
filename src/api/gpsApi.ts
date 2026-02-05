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
 * - userId는 전송하지 않음(토큰 식별 전제)
 */
export const startGpsSession = async (
  payload: GpsSessionStartRequest
): Promise<GpsSessionStartResponse> => {
  const { data } = await apiClient.post<GpsSessionStartResponse>(
    '/gps/start',
    payload
  );
  return data;
};

/**
 * GPS 로그 전송
 */
export const logGps = async (
  payload: GpsLogRequest
): Promise<GpsLogResponse> => {
  const { data } = await apiClient.post<GpsLogResponse>('/gps/log', payload);
  return data;
};

/**
 * GPS 세션 종료
 */
export const endGpsSession = async (
  payload: GpsEndRequest
): Promise<GpsEndResponse> => {
  const { data } = await apiClient.post<GpsEndResponse>('/gps/end', payload);
  return data;
};
