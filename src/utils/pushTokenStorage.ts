import AsyncStorage from '@react-native-async-storage/async-storage';

/***
 * FCM0PushToken 관리
 */

const buildLastTokenKey = (userId: number) => `fitpet:fcm:lastToken:${userId}`;

export const getLastSentPushToken = async (userId: number) => {
  return AsyncStorage.getItem(buildLastTokenKey(userId));
};

export const setLastSentPushToken = async (userId: number, token: string) => {
  await AsyncStorage.setItem(buildLastTokenKey(userId), token);
};

export const clearLastSentPushToken = async (userId: number) => {
  await AsyncStorage.removeItem(buildLastTokenKey(userId));
};
