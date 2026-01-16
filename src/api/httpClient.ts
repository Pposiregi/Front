import axios from 'axios';
import { API_BASE_URL, BODY_HISTORY_USER_ID } from '@env';

if (!API_BASE_URL) {
  throw new Error('API_BASE_URL 환경변수가 설정되지 않았습니다.');
}

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

const toLogString = (payload: unknown) => {
  try {
    if (typeof payload === 'string') return payload;
    return JSON.stringify(payload);
  } catch {
    return String(payload);
  }
};

const devUserId = BODY_HISTORY_USER_ID;
apiClient.interceptors.request.use((config) => {
  config.headers['dev-user-id'] = devUserId; // 항상 추가
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
      console.error(
        `>>> [API][${method}] ${url} ${status ?? ''}`.trim(),
        toLogString(data)
      );
    }

    return Promise.reject(error);
  }
);

export default apiClient;
