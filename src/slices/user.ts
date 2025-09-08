import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  email: '',
  accessToken: '',
  platform: '',
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser(state, action) {
      state.email = action.payload.email;
      state.accessToken = action.payload.accessToken;
      state.platform = action.payload.platform;
    },
  },
  extraReducers: (builder) => {},
});

export default userSlice;
