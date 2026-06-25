import 'antd/dist/reset.css';
import '@/styles/global.css';

import React from 'react';
import ReactDOM from 'react-dom/client';

import { AppProvider } from '@/app/providers/AppProvider';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AppProvider />
  </React.StrictMode>,
);
