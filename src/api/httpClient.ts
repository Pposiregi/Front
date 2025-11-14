import axios from 'axios';
import { API_BASE_URL } from '@env';

// 2025-11-14. KKR] 환경변수 기반 서버 기본 URL 설정 (미지정 시 고정값 사용)
const apiClient = axios.create({
  baseURL: (API_BASE_URL || '').trim() || 'http://localhost:8080',
});

export default apiClient;
