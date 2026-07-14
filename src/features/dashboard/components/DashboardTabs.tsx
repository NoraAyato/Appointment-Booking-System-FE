import { Tabs } from 'antd';
import type { ReactNode } from 'react';

export interface DashboardTabItem {
  children: ReactNode;
  key: string;
  label: ReactNode;
}

interface DashboardTabsProps {
  items: DashboardTabItem[];
}

export function DashboardTabs({ items }: DashboardTabsProps) {
  return (
    <div className="dashboard-tabs">
      <Tabs destroyOnHidden items={items} />
    </div>
  );
}
