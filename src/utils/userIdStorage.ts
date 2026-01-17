import AsyncStorage from '@react-native-async-storage/async-storage';
import { DEV_USER_ID } from '@env';

const USER_ID_KEY = 'userId';
const LEGACY_DEV_USER_ID_KEY = 'devUserId';

const migrateLegacyDevUserId = async () => {
  const legacy = await AsyncStorage.getItem(LEGACY_DEV_USER_ID_KEY);
  if (legacy) {
    await AsyncStorage.setItem(USER_ID_KEY, legacy);
    return legacy;
  }
  return null;
};

export const ensureUserIdStored = async (seed?: string) => {
  // 앱 시작 시 1회 저장해두고 이후에는 AsyncStorage 값을 사용한다.
  const existing = await AsyncStorage.getItem(USER_ID_KEY);

  if (__DEV__) {
    return Number(DEV_USER_ID);
  }

  if (existing) {
    return existing;
  }

  const migrated = await migrateLegacyDevUserId();
  if (migrated) {
    return migrated;
  }

  if (seed) {
    await AsyncStorage.setItem(USER_ID_KEY, seed);
    return seed;
  }

  return null;
};

export const getUserId = async () => {
  const existing = await AsyncStorage.getItem(USER_ID_KEY);
  if (existing) {
    return existing;
  }
  return migrateLegacyDevUserId();
};

export const setUserId = async (value: string | number) => {
  await AsyncStorage.setItem(USER_ID_KEY, String(value));
};

export const getResolvedUserId = async (
  fallback = 1,
  logPrefix = '>>> [UserId]'
) => {
  const raw = await getUserId();
  const parsed = Number(raw);
  if (!Number.isFinite(parsed)) {
    console.warn(`${logPrefix} 저장된 userId가 없어 기본값 ${fallback} 사용`);
    return fallback;
  }
  return parsed;
};
