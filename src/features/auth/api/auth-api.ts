import { axiosClient } from '@/shared/lib/axios';
import type { ApiResponse } from '@/shared/types/api-type';

import type { AuthTokenData, LoginPayload, RegisterPayload } from '../types/auth-type';

export const authApi = {
  login: async (payload: LoginPayload) => {
    const response = await axiosClient.post<ApiResponse<AuthTokenData>>('/auth/login', payload);

    return response.data;
  },

  register: async (payload: RegisterPayload) => {
    const response = await axiosClient.post<ApiResponse<AuthTokenData>>('/auth/register', payload);

    return response.data;
  },

  logout: async () => {
    const response = await axiosClient.post<ApiResponse<null>>('/auth/logout');

    return response.data;
  },
};
