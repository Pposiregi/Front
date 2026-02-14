/**
 * /gps/start 요청 payload
 * - startTime은 ISO string으로 전달
 */
export type GpsSessionStartRequest = {
  startTime: string;
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
  sessionId?: number;
  logId?: number;
  latitude?: number;
  longitude?: number;
  recordedAt?: string;
  message?: string;
};

/**
 * /gps/end 요청 payload
 * - fitpet_API.json 기준 필수값: sessionId, endTime, stepCount
 * - burnCalories는 optional
 */
export type GpsEndRequest = {
  sessionId: number;
  endTime: string;
  stepCount: number;
  burnCalories?: number;
};

/**
 * /gps/end 응답
 */
export type GpsEndResponse = {
  sessionId?: number;
  message?: string;
};
