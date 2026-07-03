import { createSlice } from '@reduxjs/toolkit';

import { fetchCurrentUser } from '@/features/users/store/user-thunk';
import type { User } from '@/features/users/types/user-type';

import { login, logout, register } from './auth-thunk';

interface AuthState {
  user: User | null;
  initialized: boolean;
  loading: boolean;
  error: string | null;
  sessionVersion: number;
}

const initialState: AuthState = {
  user: null,
  initialized: false,
  loading: false,
  error: null,
  sessionVersion: 0,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearAuthError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCurrentUser.pending, (state) => {
        if (state.sessionVersion > 0) {
          state.loading = true;
        }
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.initialized = true;
        state.loading = false;
        state.error = null;
        state.user = action.payload;
      })
      .addCase(fetchCurrentUser.rejected, (state, action) => {
        state.initialized = true;
        state.loading = false;
        state.user = null;

        if (state.sessionVersion > 0) {
          state.error = typeof action.payload === 'string' ? action.payload : 'Không thể tải thông tin người dùng.';
        }
      })
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state) => {
        state.loading = false;
        state.sessionVersion += 1;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = typeof action.payload === 'string' ? action.payload : 'Đăng nhập thất bại.';
      })
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state) => {
        state.loading = false;
        state.sessionVersion += 1;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = typeof action.payload === 'string' ? action.payload : 'Đăng kí thất bại.';
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.error = null;
      })
      .addCase(logout.rejected, (state) => {
        state.user = null;
        state.error = null;
      });
  },
});

export const { clearAuthError } = authSlice.actions;
export default authSlice.reducer;
