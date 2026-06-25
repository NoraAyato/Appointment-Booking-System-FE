import { ConfigProvider } from 'antd';
import { Provider } from 'react-redux';
import { RouterProvider } from 'react-router-dom';

import { store } from '@/app/redux/store';
import { router } from '@/app/router/routes';
import { appTheme } from '@/shared/theme/app-theme';

export function AppProvider() {
  return (
    <Provider store={store}>
      <ConfigProvider theme={appTheme}>
        <RouterProvider router={router} />
      </ConfigProvider>
    </Provider>
  );
}
