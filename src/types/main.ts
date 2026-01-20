export type DailyWalkRequest = {
  increment: number;
  distanceKm: number | 0;
  burnCalories: number | 0;
};

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
};
