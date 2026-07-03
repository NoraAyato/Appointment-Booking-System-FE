import { Modal, message } from 'antd';
import { useEffect, useState } from 'react';

import { useAppDispatch, useAppSelector } from '@/app/redux/hooks';

import { clearAuthError } from '../store/auth-slice';
import { login, register } from '../store/auth-thunk';
import type { AuthMode, ForgotPasswordPayload, LoginPayload, RegisterPayload } from '../types/auth-type';
import { ForgotPasswordForm } from './ForgotPasswordForm';
import { LoginForm } from './LoginForm';
import { RegisterForm } from './RegisterForm';

interface AuthModalProps {
  open: boolean;
  onClose: () => void;
}

export function AuthModal({ open, onClose }: AuthModalProps) {
  const [mode, setMode] = useState<AuthMode>('login');
  const dispatch = useAppDispatch();
  const { loading, error, user } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (open) {
      setMode('login');
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
    dispatch(clearAuthError());
  };

  const handleLogin = (values: LoginPayload) => {
    dispatch(login(values));
  };

  const handleRegister = (values: RegisterPayload) => {
    dispatch(register(values));
  };

  const handleForgotPassword = (_values: ForgotPasswordPayload) => {
    message.info('Luồng quên mật khẩu sẽ được nối API sau.');
  };

  const handleGoogleLogin = () => {
    message.info('Google login chưa được triển khai chức năng.');
  };

  return (
    <Modal open={open} onCancel={onClose} footer={null} width={460} destroyOnHidden>
      {mode === 'login' ? (
        <LoginForm
          error={error}
          loading={loading}
          onSubmit={handleLogin}
          onForgotPassword={() => switchMode('forgot-password')}
          onRegister={() => switchMode('register')}
          onGoogleLogin={handleGoogleLogin}
        />
      ) : null}

      {mode === 'forgot-password' ? (
        <ForgotPasswordForm
          onSubmit={handleForgotPassword}
          onBackToLogin={() => switchMode('login')}
        />
      ) : null}

      {mode === 'register' ? (
        <RegisterForm
          error={error}
          loading={loading}
          onSubmit={handleRegister}
          onLogin={() => switchMode('login')}
          onGoogleLogin={handleGoogleLogin}
        />
      ) : null}
    </Modal>
  );
}


