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

export interface ForgotPasswordPayload {
  email: string;
}

export interface AuthTokenData {
  accessToken: string;
  refreshToken: string | null;
  tokenType: string;
}
