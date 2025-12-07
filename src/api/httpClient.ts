import axios from 'axios';
import { API_BASE_URL } from '@env';

const DEV_USER_ID = '3';

// 2025-11-14. KKR] 환경변수 기반 서버 기본 URL 설정 (미지정 시 고정값 사용)
const apiClient = axios.create({
  baseURL: (API_BASE_URL || '').trim() || 'http://localhost:8080',
});

// Ensure every API call carries the required dev user header.
apiClient.defaults.headers.common['dev-user-id'] = DEV_USER_ID;

export default apiClient;
