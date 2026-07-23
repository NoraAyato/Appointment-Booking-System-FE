import { createSlice } from '@reduxjs/toolkit';

import { logout } from '@/features/auth/store/auth-thunk';

import type { User } from '../types/user-type';
import { fetchCurrentUser } from './user-thunk';

interface UserState {
  currentUser: User | null;
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  currentUser: null,
  loading: false,
  error: null,
};

const userSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    clearCurrentUser: (state) => {
      state.currentUser = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCurrentUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.currentUser = action.payload;
      })
      .addCase(fetchCurrentUser.rejected, (state, action) => {
        state.loading = false;
        state.currentUser = null;
        state.error =
          typeof action.payload === 'string' ? action.payload : 'Không thể tải thông tin người dùng.';
      })
      .addCase(logout.fulfilled, (state) => {
        state.currentUser = null;
        state.error = null;
      })
      .addCase(logout.rejected, (state) => {
        state.currentUser = null;
        state.error = null;
      });
  },
});

export const { clearCurrentUser } = userSlice.actions;
export default userSlice.reducer;
