import { axiosClient } from '@/shared/lib/axios';
import type { ApiResponse } from '@/shared/types/api-type';

import type {
  ChangePasswordPayload,
  ForgotPasswordPayload,
  GoogleLoginPayload,
  LoginPayload,
  RegisterPayload,
  ResetPasswordPayload,
  SendOtpData,
  SendOtpPayload,
  VerifyOtpPayload,
} from '../types/auth-type';

export const authApi = {
  sendOtp: async (payload: SendOtpPayload) => {
    const response = await axiosClient.post<ApiResponse<SendOtpData>>('/auth/send-otp', payload);

    return response.data;
  },

  verifyOtp: async (payload: VerifyOtpPayload) => {
    const response = await axiosClient.post<ApiResponse<null>>('/auth/verify-otp', payload);

    return response.data;
  },

  login: async (payload: LoginPayload) => {
    const response = await axiosClient.post<ApiResponse<null>>('/auth/login', payload);

    return response.data;
  },

  register: async (payload: RegisterPayload) => {
    const registerPayload = {
      email: payload.email,
      firstName: payload.firstName,
      lastName: payload.lastName,
      password: payload.password,
    };
    const response = await axiosClient.post<ApiResponse<null>>('/auth/register', registerPayload);

    return response.data;
  },

  refreshToken: async () => {
    const response = await axiosClient.post<ApiResponse<null>>('/auth/refresh-token');

    return response.data;
  },

  forgotPassword: async (payload: ForgotPasswordPayload) => {
    const response = await axiosClient.post<ApiResponse<null>>('/auth/forgot-password', payload);

    return response.data;
  },

  resetPassword: async (payload: ResetPasswordPayload) => {
    const response = await axiosClient.post<ApiResponse<null>>('/auth/reset-password', payload);

    return response.data;
  },

  changePassword: async (payload: ChangePasswordPayload) => {
    const response = await axiosClient.post<ApiResponse<null>>('/auth/change-password', payload);

    return response.data;
  },

  googleLogin: async (payload: GoogleLoginPayload) => {
    const response = await axiosClient.post<ApiResponse<null>>('/auth/google', payload);

    return response.data;
  },

  logout: async () => {
    const response = await axiosClient.post<ApiResponse<null>>('/auth/logout');

    return response.data;
  },
};
