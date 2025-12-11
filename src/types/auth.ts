export type authRequest = {
  nickname: string;
  age: number;
  gender: 'male' | 'female' | null;
  weightKg: number;
  heightCm: number;
  targetWeightKg: number;
  pbf: number;
  targetPbf: number;
  targetStepCount: number;
};

export type authResponse = {
  userId: number;
  email: string;
  nickname: string;
  age: number;
  gender: 'male' | 'female' | null;
  weightKg: number;
  targetWeightKg: number;
  heightCm: number;
  pbf: number;
  targetPbf: number;
  targetStepCount: number;
  dailyStepCount: number;
  createdAt: string;
  updatedAt: string;
};

export type signUpFormData = {
  permissions: {
    locationAgree: boolean;
    privacyAgree: boolean;
    pushAgree: boolean;
  };
  nickName: string;
  birth: {
    year: string;
    month: string;
    day: string;
  };
  gender: 'male' | 'female' | null;
  weightKg: string;
  heightCm: string;
  targetWeightKg: string;
  pbf: string;
  targetPbf: string;
  targetStepCount: string;
};
