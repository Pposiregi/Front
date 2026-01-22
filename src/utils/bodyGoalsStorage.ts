import AsyncStorage from '@react-native-async-storage/async-storage';

export type BodyGoals = {
  weightAim?: number;
  bodyFatAim?: number;
};

const BODY_GOALS_KEY = 'fitpet:bodyGoals';

// 목표값 로컬 저장소에서 읽기 (잘못된 타입은 무시)
export const loadBodyGoals = async (): Promise<BodyGoals> => {
  try {
    const raw = await AsyncStorage.getItem(BODY_GOALS_KEY);
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
export const saveBodyGoals = async (goals: BodyGoals) => {
  try {
    await AsyncStorage.setItem(BODY_GOALS_KEY, JSON.stringify(goals));
  } catch (err) {
    console.warn('[BodyGoals] 저장 실패', err);
  }
};
