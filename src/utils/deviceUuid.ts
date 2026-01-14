import AsyncStorage from '@react-native-async-storage/async-storage';

/***
 * Device UUID 관리 Util
 */

// 앱 재설정 전까지 유지되는 기기 식별자 저장 키
const DEVICE_UUID_KEY = 'deviceUuid';

const generateDeviceUuid = () => {
  // 외부 의존성 없이 UUID v4 형태를 만들어 저장한다.
  let seed = Date.now();
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (char) => {
    const rand = (seed + Math.random() * 16) % 16 | 0;
    seed = Math.floor(seed / 16);
    const value = char === 'x' ? rand : (rand & 0x3) | 0x8;
    return value.toString(16);
  });
};

/**
 * GET 디바이스 UUID in 스토리지
 * @returns Device UUID
 */
export const getDeviceUuid = async () => {
  return AsyncStorage.getItem(DEVICE_UUID_KEY);
};

/**
 * GET 디바이스 UUID in 스토리지
 * - 없을 경우, 새롭게 생성
 * @returns
 */
export const getOrCreateDeviceUuid = async () => {
  // 재로그인/앱 재시작 시 동일 값을 사용하도록 1회 생성 후 보관
  const existing = await AsyncStorage.getItem(DEVICE_UUID_KEY);
  if (existing) {
    return existing;
  }

  const created = generateDeviceUuid();
  await AsyncStorage.setItem(DEVICE_UUID_KEY, created);
  return created;
};
