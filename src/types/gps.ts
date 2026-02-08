/**
 * /gps/start 요청 payload
 * - startTime은 ISO string으로 전달
 */
export type GpsSessionStartRequest = {
  startTime: string;
  userId?: number;
};

/**
 * /gps/start 응답
 */
export type GpsSessionStartResponse = {
  sessionId: number;
  message?: string;
};

/**
 * /gps/log 요청 payload
 * - speed/altitude는 현재 확보 가능할 때만 optional로 전달
 */
export type GpsLogRequest = {
  sessionId: number;
  latitude: number;
  longitude: number;
  recordedAt: string;
  speed?: number;
  altitude?: number;
};

/**
 * /gps/log 응답
 */
export type GpsLogResponse = {
  logId?: number;
  latitude?: number;
  longitude?: number;
  recordedAt?: string;
  message?: string;
};

/**
 * /gps/end 요청 payload
 * - distance 단위는 스펙 기준으로 전달(현재 m 기준)
 */
export type GpsEndRequest = {
  sessionId: number;
  endTime: string;
  stepCount: number;
  distance: number;
};

/**
 * /gps/end 응답
 */
export type GpsEndResponse = {
  sessionId?: number;
  message?: string;
};
