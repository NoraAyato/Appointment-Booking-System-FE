import { ConfigProvider } from 'antd';
import { QueryClientProvider } from '@tanstack/react-query';
import { Provider } from 'react-redux';
import { RouterProvider } from 'react-router-dom';

import { store } from '@/app/redux/store';
import { router } from '@/app/router/routes';
import { queryClient } from '@/shared/lib/query-client';
import { appTheme } from '@/shared/theme/app-theme';

export function AppProvider() {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <ConfigProvider theme={appTheme}>
          <RouterProvider router={router} />
        </ConfigProvider>
      </QueryClientProvider>
    </Provider>
  );
}
