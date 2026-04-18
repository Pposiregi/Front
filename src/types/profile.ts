export type PetType = 'DOG' | 'CAT';

export type UserUpdateRequest = {
  email?: string;
  password?: string;
  nickname?: string;
  age?: number;
  gender?: 'male' | 'female';
  weightKg?: number;
  heightCm?: number;
  targetWeightKg?: number;
  targetPbf?: number;
  targetStepCount?: number;
  profileImageUrl?: string;
};

export type PetUpdateRequest = {
  name?: string;
  petType?: PetType;
  color?: string;
};

export type ProfileImageUploadResponse = {
  imageKey: string;
  uploadUrl: string;
};
