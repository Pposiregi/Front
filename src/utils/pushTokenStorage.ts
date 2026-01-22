import AsyncStorage from '@react-native-async-storage/async-storage';

/***
 * FCM0PushToken 관리
 */

const LAST_TOKEN_KEY = 'fitpet:fcm:lastToken';

export const getLastSentPushToken = async () => {
  return AsyncStorage.getItem(LAST_TOKEN_KEY);
};

export const setLastSentPushToken = async (token: string) => {
  await AsyncStorage.setItem(LAST_TOKEN_KEY, token);
};

export const clearLastSentPushToken = async () => {
  await AsyncStorage.removeItem(LAST_TOKEN_KEY);
};
