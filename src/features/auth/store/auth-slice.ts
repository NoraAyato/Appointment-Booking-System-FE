import { createSlice } from '@reduxjs/toolkit';

import { login, logout, register } from './auth-thunk';

interface AuthState {
  initialized: boolean;
  loading: boolean;
  error: string | null;
  sessionVersion: number;
}

const initialState: AuthState = {
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
    markAuthInitialized: (state) => {
      state.initialized = true;
    },
  },
  extraReducers: (builder) => {
    builder
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
        state.error = null;
      })
      .addCase(logout.rejected, (state) => {
        state.error = null;
      });
  },
});

export const { clearAuthError, markAuthInitialized } = authSlice.actions;
export default authSlice.reducer;
