import type { ThemeConfig } from 'antd';

export const appTheme: ThemeConfig = {
  token: {
    colorPrimary: '#214f45',
    colorInfo: '#214f45',
    colorSuccess: '#3f8a65',
    colorWarning: '#c6862f',
    colorError: '#c94c4c',
    colorTextBase: '#17223b',
    colorBgLayout: '#f7f4ee',
    borderRadius: 8,
    fontFamily: 'Inter, ui-sans-serif, system-ui, sans-serif',
  },
  components: {
    Button: {
      borderRadius: 8,
      controlHeight: 42,
      fontWeight: 600,
    },
    Card: {
      borderRadiusLG: 8,
      headerFontSize: 16,
    },
    Input: {
      borderRadius: 8,
      controlHeight: 42,
    },
    Select: {
      borderRadius: 8,
      controlHeight: 42,
    },
  },
};
