import type { ReactNode } from 'react';

export interface DashboardNavItem {
  children?: DashboardNavItem[];
  icon?: ReactNode;
  key: string;
  label: string;
  path?: string;
}
