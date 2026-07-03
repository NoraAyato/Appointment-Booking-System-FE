import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

import { authApi } from '../api/auth-api';
import type { LoginPayload, RegisterPayload } from '../types/auth-type';

const getErrorMessage = (error: unknown, fallback: string) => {
  if (axios.isAxiosError<{ message?: string }>(error)) {
    return error.response?.data?.message ?? error.message ?? fallback;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return fallback;
};

export const login = createAsyncThunk('auth/login', async (payload: LoginPayload, { rejectWithValue }) => {
  try {
    await authApi.login(payload);
  } catch (error) {
    return rejectWithValue(getErrorMessage(error, 'Đăng nhập thất bại.'));
  }
});

export const register = createAsyncThunk(
  'auth/register',
  async (payload: RegisterPayload, { rejectWithValue }) => {
    try {
      await authApi.register(payload);
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, 'Đăng kí thất bại.'));
    }
  },
);

export const logout = createAsyncThunk('auth/logout', async () => {
  await authApi.logout();
});
