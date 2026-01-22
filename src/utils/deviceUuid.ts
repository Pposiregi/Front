import DeviceInfo from 'react-native-device-info';
import { Platform } from 'react-native';

/***
 * Device UUID 관리 Util
 * - Android: ANDROID_ID 사용 (재설치 후에도 보통 유지됨)
 */

const assertAndroidOnly = () => {
  if (Platform.OS !== 'android') {
    throw new Error('Device UUID는 Android 전용입니다.');
  }
};

const getAndroidId = async () => {
  try {
    assertAndroidOnly();
    const androidId = await DeviceInfo.getUniqueIdSync(); // getAndroidId();
    if (!androidId) {
      throw new Error('ANDROID_ID를 가져올 수 없습니다.');
    }
    return androidId;
  } catch (err) {
    console.warn('>>> [DeviceUuid] ANDROID_ID 조회 실패', err);
    throw err;
  }
};

/**
 * GET 디바이스 UUID in 스토리지
 * @returns Device UUID
 */
export const getDeviceUuid = async () => {
  return getAndroidId();
};

/**
 * GET 디바이스 UUID in 스토리지
 * - 없을 경우, 새롭게 생성
 * @returns
 */
export const getOrCreateDeviceUuid = async () => {
  return getAndroidId();
};
