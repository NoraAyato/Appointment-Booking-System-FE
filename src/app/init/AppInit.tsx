import { Spin } from 'antd';
import { useEffect } from 'react';

import { useAppDispatch, useAppSelector } from '@/app/redux/hooks';
import { markAuthInitialized } from '@/features/auth/store/auth-slice';
import { clearCurrentUser } from '@/features/users/store/user-slice';
import { fetchCurrentUser } from '@/features/users/store/user-thunk';

interface AppInitProps {
  children: React.ReactNode;
}

export function AppInit({ children }: AppInitProps) {
  const dispatch = useAppDispatch();
  const initialized = useAppSelector((state) => state.auth.initialized);
  const sessionVersion = useAppSelector((state) => state.auth.sessionVersion);

  useEffect(() => {
    dispatch(fetchCurrentUser()).finally(() => {
      dispatch(markAuthInitialized());
    });
  }, [dispatch, sessionVersion]);

  useEffect(() => {
    const handleAuthExpired = () => {
      dispatch(clearCurrentUser());
    };

    window.addEventListener('auth:expired', handleAuthExpired);

    return () => {
      window.removeEventListener('auth:expired', handleAuthExpired);
    };
  }, [dispatch]);

  if (!initialized) {
    return (
      <div className="grid min-h-screen place-items-center bg-[#f7f4ed]">
        <Spin size="large" />
      </div>
    );
  }

  return children;
}
