export type authRequest = {
  nickname: string;
  age: number;
  gender: 'male' | 'female';
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
  gender: 'male' | 'female';
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
    year: number;
    month: number;
    day: number;
  };
  gender: 'male' | 'female';
  weightKg: number;
  heightCm: number;
  targetWeightKg: number;
  pbf: number;
  targetPbf: number;
  targetStepCount: number;
};
