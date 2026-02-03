import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState = {
  email: '',
  accessToken: '',
  isSignUpInProgress: false,
  userId: null as number | null,
  nickname: '',
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setAuth(state, action) {
      state.email = action.payload.email;
      state.accessToken = action.payload.accessToken;
    },
    setUser(state, action) {
      state.userId = action.payload.userId;
      state.nickname = action.payload.nickname;
    },
    setSignUpInProgress(state, action: PayloadAction<boolean>) {
      state.isSignUpInProgress = action.payload;
    },
    resetUser() {
      // 상태를 초기 상태(initialState)로 재설정합니다.
      return initialState;
    },
  },
  extraReducers: (builder) => {},
});

export default userSlice;
