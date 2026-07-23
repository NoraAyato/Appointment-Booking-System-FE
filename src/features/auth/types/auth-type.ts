export type AuthMode = 'login' | 'forgot-password' | 'register';

export interface BaseAuthPayload {
  email: string;
  password: string;
}

export interface LoginPayload extends BaseAuthPayload {
  rememberMe?: boolean;
}

export interface RegisterPayload extends BaseAuthPayload {
  repeatPassword: string;
  firstName: string;
  lastName: string;
}

export interface SendOtpPayload {
  email: string;
}

export interface VerifyOtpPayload {
  email: string;
  otp: string;
}

export interface ForgotPasswordPayload {
  email: string;
}

export interface ResetPasswordPayload {
  token: string;
  newPassword: string;
}

export interface ChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
  rePassword: string;
}

export interface GoogleLoginPayload {
  idToken: string;
}

export interface SendOtpData {
  message: string;
}
