import axios from 'axios';
import { API_BASE_URL, BODY_HISTORY_USER_ID } from '@env';

// 환경변수(API_BASE_URL)가 있으면 우선 사용하고, 없으면 로컬 기본값으로 대체
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  //   || 'http://10.0.0.8:8080').trim(),
});

const toLogString = (payload: unknown) => {
  try {
    if (typeof payload === 'string') return payload;
    return JSON.stringify(payload);
  } catch {
    return String(payload);
  }
};

apiClient.interceptors.request.use((config) => {
  config.headers['dev-user-id'] = BODY_HISTORY_USER_ID; // 항상 추가
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

    console.error(
      `>>> [API][${method}] ${url} ${status ?? ''}`.trim(),
      toLogString(data)
    );

    return Promise.reject(error);
  }
);

export default apiClient;
