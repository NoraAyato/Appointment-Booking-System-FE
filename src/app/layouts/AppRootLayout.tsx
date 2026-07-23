import { Outlet } from 'react-router-dom';

import { AppInit } from '@/app/init/AppInit';

export function AppRootLayout() {
  return (
    <AppInit>
      <Outlet />
    </AppInit>
  );
}