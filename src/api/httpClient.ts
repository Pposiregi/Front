import axios from 'axios';
import { API_BASE_URL, YOUR_API_KEY } from '@env';
import EncryptedStorage from 'react-native-encrypted-storage';
import { DEV_USER_ID } from '@env';

if (!API_BASE_URL) {
  throw new Error('API_BASE_URL 환경변수가 설정되지 않았습니다.');
}

/**
 * 공통 API 클라이언트
 * - baseURL, 인증 헤더, 응답 로깅 등을 일괄 관리
 */
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

/**
 * 로그 출력용 문자열 변환 유틸
 */
const toLogString = (payload: unknown) => {
  try {
    if (typeof payload === 'string') return payload;
    return JSON.stringify(payload);
  } catch {
    return String(payload);
  }
};

/**
 * 민감한 헤더 값을 마스킹
 */
const redactHeaders = (headers: unknown) => {
  const rawHeaders =
    typeof (headers as { toJSON?: () => unknown })?.toJSON === 'function'
      ? (headers as { toJSON: () => unknown }).toJSON()
      : headers;

  if (!rawHeaders || typeof rawHeaders !== 'object') {
    return rawHeaders;
  }

  const redacted = { ...(rawHeaders as Record<string, unknown>) };
  const sensitiveKeys = ['authorization', 'cookie', 'set-cookie', 'x-api-key'];

  Object.keys(redacted).forEach((key) => {
    if (sensitiveKeys.includes(key.toLowerCase())) {
      redacted[key] = '***';
    }
  });

  return redacted;
};

/**
 * 요청 인터셉터.
 * - 개발 환경 dev-user-id 주입
 * - accessToken 자동 부착
 */
apiClient.interceptors.request.use(async (config) => {
  if (__DEV__ && DEV_USER_ID) {
    // 개발환경에서는 env 값으로 dev_user_id를 고정한다.
    config.headers = config.headers ?? {};
    config.headers['dev-user-id'] = DEV_USER_ID;
    console.log('>>> dev-user-id: ' + DEV_USER_ID);
  }

  const hasAuthHeader =
    Boolean(config.headers?.Authorization) ||
    Boolean(
      (config.headers as Record<string, unknown> | undefined)?.authorization
    );
  if (!hasAuthHeader) {
    const accessToken = await EncryptedStorage.getItem('serverAccessToken');
    if (accessToken) {
      config.headers = config.headers ?? {};
      config.headers.Authorization = `Bearer ${accessToken}`;
      if (__DEV__) {
        console.log('>>> [JWT] accesstoken: ' + accessToken);
      }
    }
  }
  return config;
});

/**
 * 응답 인터셉터
 * - 성공 응답 요약 로깅
 * - 실패 응답은 개발 환경에서 상세 로깅
 */
apiClient.interceptors.response.use(
  (response) => {
    const status = response?.status;
    const data = response?.data;

    console.log(`>>> [API][${status}] :`, toLogString(data));
    return response;
  },
  async (error) => {
    const { config, response } = error || {};
    const method = config?.method?.toUpperCase?.() || 'UNKNOWN';
    const url = config?.url || 'UNKNOWN';
    const status = response?.status;
    const data = response?.data;
    const originalRequest = config;
    /** 1. accessToekn 시간 만료로 인해 401(인증 오류) 발생 시 refreshToken을 기준으로 재 발급
     * 2. 만약 api 호출 경로가 /auth일 경우 제외 */
    const isAuthRequest = originalRequest?.url?.startsWith('/auth');
    if (
      response?.status === 401 &&
      !originalRequest?._retry &&
      !isAuthRequest
    ) {
      originalRequest._retry = true;
      try {
        const refreshToken = await EncryptedStorage.getItem('refreshToken');
        if (!refreshToken) throw new Error('No refresh token');
        const refreshRes = await apiClient.post(
          '/auth/refresh',
          {},
          {
            headers: {
              Authorization: `Bearer ${refreshToken}`,
            },
          }
        );
        const newAccessToken = refreshRes.data.serverAccessToken;
        await EncryptedStorage.setItem('serverAccessToken', newAccessToken);
        // 원본 요청에 새 토큰 주입
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        return apiClient(originalRequest);
      } catch (refreshErr) {
        await EncryptedStorage.clear();
        return Promise.reject(refreshErr);
      }
    }

    if (__DEV__) {
      const requestInfo = {
        baseURL: config?.baseURL,
        url,
        method,
        params: config?.params,
        data: config?.data,
        headers: redactHeaders(config?.headers),
      };
      const responseInfo = { status, data };

      console.error(
        `>>> [API][${method}] ${url} ${status ?? ''}`.trim(),
        toLogString({ request: requestInfo, response: responseInfo })
      );
    }

    return Promise.reject(error);
  }
);

export default apiClient;
