import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState = {
  email: '',
  accessToken: '',
  isSignUpInProgress: false,
  isRunningActive: false,
  userId: null as number | null,
  nickname: '',
  profileImageId: 1,
  gender: null as 'female' | 'male' | null,
  petId: null as number | null,
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
        profileImageId?: number;
      }>
    ) {
      state.userId = action.payload.userId;
      state.nickname = action.payload.nickname;
      state.gender = action.payload.gender;
      state.profileImageId =
        action.payload.profileImageId ?? state.profileImageId;
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
    updateProfileImageId(state, action: PayloadAction<number>) {
      state.profileImageId = action.payload;
    },
    resetUser() {
      // 상태를 초기 상태(initialState)로 재설정합니다.
      return initialState;
    },
  },
});

export default userSlice;
