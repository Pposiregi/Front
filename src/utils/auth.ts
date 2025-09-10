import { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, KAKAO_CLIENT_ID } from '@env';
import axios from 'axios';

// 플랫폼별 토큰 갱신 로직을 담은 함수들
const tokenRefreshers = {
  kakao: async (refreshToken: string) => {
    const params = new URLSearchParams({
      grant_type: 'refresh_token',
      client_id: KAKAO_CLIENT_ID,
      refresh_token: refreshToken,
    }).toString();
    const res = await axios.post(
      'https://kauth.kakao.com/oauth/token',
      params,
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
        },
      }
    );
    return {
      accessToken: res.data.access_token,
      refreshToken: res.data.refresh_token,
    };
  },
  google: async (refreshToken: string) => {
    const res = await axios.post('https://oauth2.googleapis.com/token', {
      client_id: GOOGLE_CLIENT_ID,
      client_secret: GOOGLE_CLIENT_SECRET,
      refresh_token: refreshToken,
      grant_type: 'refresh_token',
    });
    return {
      accessToken: res.data.access_token,
      refreshToken: res.data.refresh_token,
    };
  },
};

export default tokenRefreshers;
