import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { authApi } from '../api/auth-api';
import type { LoginPayload, User } from '../types/auth-type';

interface AuthState {
  user: User | null;
  initialized: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  initialized: false,
  loading: false,
  error: null,
};

export const initializeAuth = createAsyncThunk('auth/initialize', async () => null);

export const login = createAsyncThunk('auth/login', async (payload: LoginPayload) => {
  const response = await authApi.login(payload);

  return response.data;
});

export const logout = createAsyncThunk('auth/logout', async () => {
  await authApi.logout();
});

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
      .addCase(initializeAuth.fulfilled, (state) => {
        state.initialized = true;
      })
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? 'Đăng nhập thất bại.';
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.error = null;
      });
  },
});

export const { clearAuthError } = authSlice.actions;
export default authSlice.reducer;
