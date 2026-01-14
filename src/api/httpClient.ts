import axios from 'axios';
import { API_BASE_URL, DEV_USER_ID } from '@env';

if (!API_BASE_URL) {
  throw new Error('API_BASE_URL 환경변수가 설정되지 않았습니다.');
}

const apiClient = axios.create({
  baseURL: API_BASE_URL,
});

const toLogString = (payload: unknown) => {
  try {
    if (typeof payload === 'string') return payload;
    return JSON.stringify(payload);
  } catch {
    return String(payload);
  }
};

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

apiClient.interceptors.request.use((config) => {
  if (DEV_USER_ID) {
    config.headers['dev-user-id'] = String(DEV_USER_ID); // dev 전용 헤더
  }
  return config;
});

/***
 * 응답 인터셉터: 에러 로깅
 * - 모든 응답에서 에러를 잡아내어 메서드, URL, 상태 코드, 응답 데이터를 콘솔에 로깅
 * - 명령어: adb logcat | grep '>>> [API]'
 * - 2025.12.16 KGYURY
 */
apiClient.interceptors.response.use(
  (response) => {
    const status = response?.status;
    const data = response?.data;

    console.log(`>>> [API][${status}] :`, toLogString(data));
    return response;
  },
  (error) => {
    const { config, response } = error || {};
    const method = config?.method?.toUpperCase?.() || 'UNKNOWN';
    const url = config?.url || 'UNKNOWN';
    const status = response?.status;
    const data = response?.data;

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
