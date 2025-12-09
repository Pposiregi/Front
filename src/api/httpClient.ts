import axios from 'axios';
import { API_BASE_URL } from '@env';

// 2025-11-14. KKR] 환경변수 기반 서버 기본 URL 설정 (미지정 시 고정값 사용)
const apiClient = axios.create({
  baseURL: 'http://10.0.2.2:8080',
});

apiClient.interceptors.request.use((config) => {
  config.headers['dev-user-id'] = '3'; // 항상 추가
  return config;
});

export default apiClient;
