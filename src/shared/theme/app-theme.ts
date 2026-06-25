import type { ThemeConfig } from 'antd';

export const appTheme: ThemeConfig = {
  token: {
    colorPrimary: '#2f7d67',
    colorInfo: '#2f7d67',
    colorSuccess: '#438d69',
    colorWarning: '#d99530',
    colorError: '#c94c4c',
    colorTextBase: '#17223b',
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
