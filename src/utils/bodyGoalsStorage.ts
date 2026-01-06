import AsyncStorage from '@react-native-async-storage/async-storage';

export type BodyGoals = {
  weightAim?: number;
  bodyFatAim?: number;
};

const buildKey = (userId: number) => `fitpet:bodyGoals:${userId}`;

// 목표값 로컬 저장소에서 읽기 (잘못된 타입은 무시)
export const loadBodyGoals = async (userId: number): Promise<BodyGoals> => {
  try {
    const raw = await AsyncStorage.getItem(buildKey(userId));
    if (!raw) return {};
    const parsed = JSON.parse(raw) as BodyGoals;
    return {
      weightAim:
        typeof parsed.weightAim === 'number' ? parsed.weightAim : undefined,
      bodyFatAim:
        typeof parsed.bodyFatAim === 'number' ? parsed.bodyFatAim : undefined,
    };
  } catch (err) {
    console.warn('[BodyGoals] 로드 실패', err);
    return {};
  }
};

// 목표값을 AsyncStorage에 저장
export const saveBodyGoals = async (userId: number, goals: BodyGoals) => {
  try {
    await AsyncStorage.setItem(buildKey(userId), JSON.stringify(goals));
  } catch (err) {
    console.warn('[BodyGoals] 저장 실패', err);
  }
};
