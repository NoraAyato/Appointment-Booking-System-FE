import { Spin } from 'antd';
import { useEffect } from 'react';

import { useAppDispatch, useAppSelector } from '@/app/redux/hooks';
import { initializeAuth } from '@/features/auth/store/auth-slice';

interface AppInitProps {
  children: React.ReactNode;
}

export function AppInit({ children }: AppInitProps) {
  const dispatch = useAppDispatch();
  const initialized = useAppSelector((state) => state.auth.initialized);

  useEffect(() => {
    dispatch(initializeAuth());
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
