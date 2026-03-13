import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { PetType } from 'types/profile';

const initialState = {
  email: '',
  accessToken: '',
  isSignUpInProgress: false,
  isRunningActive: false,
  userId: null as number | null,
  nickname: '',
  profileImageId: 1,
  gender: null as 'female' | 'male' | null,
  petType: 'CAT' as PetType,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setAuth(
      state,
      action: PayloadAction<{ accessToken: string; platform?: string }>
    ) {
      state.accessToken = action.payload.accessToken;
    },
    setUser(
      state,
      action: PayloadAction<{
        userId: number;
        nickname: string;
        gender: 'female' | 'male' | null;
        profileImageId?: number;
        petType?: PetType;
      }>
    ) {
      state.userId = action.payload.userId;
      state.nickname = action.payload.nickname;
      state.gender = action.payload.gender;
      state.profileImageId =
        action.payload.profileImageId ?? state.profileImageId;
      state.petType = action.payload.petType ?? state.petType;
    },
    setSignUpInProgress(state, action: PayloadAction<boolean>) {
      state.isSignUpInProgress = action.payload;
    },
    setRunningActive(state, action: PayloadAction<boolean>) {
      state.isRunningActive = action.payload;
    },
    updateNickname(state, action: PayloadAction<string>) {
      state.nickname = action.payload;
    },
    updateProfileImageId(state, action: PayloadAction<number>) {
      state.profileImageId = action.payload;
    },
    updatePetType(state, action: PayloadAction<PetType>) {
      state.petType = action.payload;
    },
    resetUser() {
      // 상태를 초기 상태(initialState)로 재설정합니다.
      return initialState;
    },
  },
});

export default userSlice;
