import { Spin } from 'antd';
import { useEffect } from 'react';

import { useAppDispatch, useAppSelector } from '@/app/redux/hooks';
import { fetchCurrentUser } from '@/features/users/store/user-thunk';

interface AppInitProps {
  children: React.ReactNode;
}

export function AppInit({ children }: AppInitProps) {
  const dispatch = useAppDispatch();
  const initialized = useAppSelector((state) => state.auth.initialized);
  const sessionVersion = useAppSelector((state) => state.auth.sessionVersion);

  useEffect(() => {
    dispatch(fetchCurrentUser());
  }, [dispatch, sessionVersion]);

  if (!initialized) {
    return (
      <div className="grid min-h-screen place-items-center bg-[#f7f4ed]">
        <Spin size="large" />
      </div>
    );
  }

  return children;
}
