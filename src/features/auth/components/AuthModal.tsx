import { Modal, message } from 'antd';
import { useEffect, useMemo, useState } from 'react';

import { useAppDispatch, useAppSelector } from '@/app/redux/hooks';
import { getApiErrorMessage } from '@/shared/utils/api-error';

import { authApi } from '../api/auth-api';
import { clearAuthError } from '../store/auth-slice';
import { login, register } from '../store/auth-thunk';
import type { AuthMode, ForgotPasswordPayload, LoginPayload, RegisterPayload, VerifyOtpPayload } from '../types/auth-type';
import { ForgotPasswordForm } from './ForgotPasswordForm';
import { LoginForm } from './LoginForm';
import { RegisterForm } from './RegisterForm';

interface AuthModalProps {
  open: boolean;
  onClose: () => void;
}

const getGoogleAuthorizationUrl = () => {
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  const apiUrl = import.meta.env.VITE_API_URL;

  if (!clientId || !apiUrl) {
    return null;
  }

  const authUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
  authUrl.searchParams.set('client_id', clientId);
  authUrl.searchParams.set('redirect_uri', `${apiUrl.replace(/\/$/, '')}/auth/google/callback`);
  authUrl.searchParams.set('response_type', 'code');
  authUrl.searchParams.set('scope', 'openid email profile');
  authUrl.searchParams.set('prompt', 'select_account');

  return authUrl.toString();
};

export function AuthModal({ open, onClose }: AuthModalProps) {
  const [mode, setMode] = useState<AuthMode>('login');
  const [flowLoading, setFlowLoading] = useState(false);
  const [flowError, setFlowError] = useState<string | null>(null);
  const [forgotPasswordSent, setForgotPasswordSent] = useState(false);
  const dispatch = useAppDispatch();
  const { loading: authLoading, error } = useAppSelector((state) => state.auth);
  const userLoading = useAppSelector((state) => state.users.loading);
  const user = useAppSelector((state) => state.users.currentUser);
  const loading = authLoading || userLoading || flowLoading;
  const visibleError = flowError ?? error;
  const googleAuthorizationUrl = useMemo(getGoogleAuthorizationUrl, []);

  useEffect(() => {
    if (open) {
      setMode('login');
      setFlowError(null);
      setForgotPasswordSent(false);
      dispatch(clearAuthError());
    }
  }, [dispatch, open]);

  useEffect(() => {
    if (user && open) {
      onClose();
    }
  }, [onClose, open, user]);

  const switchMode = (nextMode: AuthMode) => {
    setMode(nextMode);
    setFlowError(null);
    setForgotPasswordSent(false);
    dispatch(clearAuthError());
  };

  const handleLogin = (values: LoginPayload) => {
    setFlowError(null);
    dispatch(login(values));
  };

  const handleSendOtp = async (email: string) => {
    setFlowLoading(true);
    setFlowError(null);

    try {
      await authApi.sendOtp({ email });
      message.success('OTP đã được gửi đến email của bạn.');
    } catch (requestError) {
      const nextError = getApiErrorMessage(requestError, 'Không thể gửi OTP.');
      setFlowError(nextError);
      throw requestError;
    } finally {
      setFlowLoading(false);
    }
  };

  const handleVerifyOtp = async (values: VerifyOtpPayload) => {
    setFlowLoading(true);
    setFlowError(null);

    try {
      await authApi.verifyOtp(values);
    } catch (requestError) {
      const nextError = getApiErrorMessage(requestError, 'OTP không hợp lệ hoặc đã hết hạn.');
      setFlowError(nextError);
      throw requestError;
    } finally {
      setFlowLoading(false);
    }
  };

  const handleRegister = (values: RegisterPayload) => {
    setFlowError(null);
    dispatch(register(values));
  };

  const handleForgotPassword = async (values: ForgotPasswordPayload) => {
    setFlowLoading(true);
    setFlowError(null);

    try {
      await authApi.forgotPassword(values);
      setForgotPasswordSent(true);
    } catch (requestError) {
      setFlowError(getApiErrorMessage(requestError, 'Không thể gửi email đặt lại mật khẩu.'));
    } finally {
      setFlowLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    if (!googleAuthorizationUrl) {
      message.error('Thiếu cấu hình VITE_GOOGLE_CLIENT_ID để đăng nhập Google.');
      return;
    }

    window.location.assign(googleAuthorizationUrl);
  };

  return (
    <Modal open={open} onCancel={onClose} footer={null} width={460} destroyOnHidden>
      {mode === 'login' ? (
        <LoginForm
          error={visibleError}
          loading={loading}
          onSubmit={handleLogin}
          onForgotPassword={() => switchMode('forgot-password')}
          onRegister={() => switchMode('register')}
          onGoogleLogin={handleGoogleLogin}
        />
      ) : null}

      {mode === 'forgot-password' ? (
        <ForgotPasswordForm
          error={visibleError}
          loading={loading}
          sent={forgotPasswordSent}
          onSubmit={(values) => {
            void handleForgotPassword(values);
          }}
          onBackToLogin={() => switchMode('login')}
        />
      ) : null}

      {mode === 'register' ? (
        <RegisterForm
          error={visibleError}
          loading={loading}
          onSendOtp={handleSendOtp}
          onVerifyOtp={handleVerifyOtp}
          onSubmit={handleRegister}
          onLogin={() => switchMode('login')}
          onGoogleLogin={handleGoogleLogin}
        />
      ) : null}
    </Modal>
  );
}
