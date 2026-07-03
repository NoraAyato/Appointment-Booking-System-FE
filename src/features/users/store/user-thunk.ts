import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

import { userApi } from '../api/user-api';

const getErrorMessage = (error: unknown, fallback: string) => {
  if (axios.isAxiosError<{ message?: string }>(error)) {
    return error.response?.data?.message ?? error.message ?? fallback;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return fallback;
};

export const fetchCurrentUser = createAsyncThunk('users/fetchCurrentUser', async (_, { rejectWithValue }) => {
  try {
    const response = await userApi.getMe();

    return response.data;
  } catch (error) {
    return rejectWithValue(getErrorMessage(error, 'Không thể tải thông tin người dùng.'));
  }
});
