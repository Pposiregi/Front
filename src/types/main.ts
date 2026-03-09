import { Pet } from './pet';

/**
 * 일정 걸음 마다 수집해서 보내는 요청 타입
 * 현재는 increment만 보내주는 중, distanceKm랑 burnCalories는 계산식이 필요함!
 */
export type DailyWalkRequest = {
  step: number;
  distanceKm: number | 0;
  burnCalories: number | 0;
};

/**
 * 일정 걸음 마다 수집해서 보내는 응답 타입
 */
export type DailyWalkResponse = {
  id: number;
  step: number;
  distanceKm: number;
  burnCalories: number;
};

/**
 * 유저 정보 응답 타입
 */
export type getUserResponse = {
  userId: number;
  email: string;
  nickname: string | null;
  age: number;
  gender: 'female' | 'male' | null;
  weightKg: number;
  targetWeightKg: number | null;
  heightCm: number;
  pbf: number | null;
  targetPbf: number | null;
  targetStepCount: number | null;
  dailyStepCount: number;
  profileImageUrl: number;
  pet: Pet | null;
};
