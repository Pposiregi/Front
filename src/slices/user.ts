import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { PetType } from 'types/profile';
import { DEFAULT_PROFILE_URL } from '@shared/constants/profileIcons';

const initialState = {
  email: '',
  accessToken: '',
  isSignUpInProgress: false,
  isRunningActive: false,
  userId: null as number | null,
  nickname: '',
  profileImageUrl: DEFAULT_PROFILE_URL,
  gender: null as 'female' | 'male' | null,
  petId: null as number | null,
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
    setNickName(state, action: PayloadAction<{ nickname: string }>) {
      state.nickname = action.payload.nickname;
    },
    setUser(
      state,
      action: PayloadAction<{
        userId: number;
        nickname: string;
        gender: 'female' | 'male' | null;
        profileImageUrl?: string;
        petType?: PetType;
      }>
    ) {
      state.userId = action.payload.userId;
      state.nickname = action.payload.nickname;
      state.gender = action.payload.gender;
      state.profileImageUrl =
        action.payload.profileImageUrl ?? state.profileImageUrl;
      state.petType = action.payload.petType ?? state.petType;
    },
    setSignUpInProgress(state, action: PayloadAction<boolean>) {
      state.isSignUpInProgress = action.payload;
    },
    setRunningActive(state, action: PayloadAction<boolean>) {
      state.isRunningActive = action.payload;
    },
    setPet(state, action: PayloadAction<number>) {
      state.petId = action.payload;
    },
    updateNickname(state, action: PayloadAction<string>) {
      state.nickname = action.payload;
    },
    updateProfileImageUrl(state, action: PayloadAction<string>) {
      state.profileImageUrl = action.payload;
    },
    updatePetType(state, action: PayloadAction<PetType>) {
      state.petType = action.payload;
    },
    resetUser() {
      return initialState;
    },
  },
});

export default userSlice;
