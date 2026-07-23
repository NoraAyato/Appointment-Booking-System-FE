import { Typography } from 'antd';
import type { ReactNode } from 'react';

export interface DashboardBarItem {
  color?: string;
  label: ReactNode;
  meta?: ReactNode;
  value: number;
}

interface DashboardBarListProps {
  formatter?: (value: number) => ReactNode;
  items: DashboardBarItem[];
}

export function DashboardBarList({ formatter, items }: DashboardBarListProps) {
  const maxValue = Math.max(...items.map((item) => item.value), 1);

  return (
    <div className="dashboard-bar-list">
      {items.map((item, index) => {
        const percent = Math.max(4, Math.round((item.value / maxValue) * 100));

        return (
          <div key={`${item.label}-${index}`} className="dashboard-bar-row">
            <div className="dashboard-bar-row-header">
              <Typography.Text strong>{item.label}</Typography.Text>
              <span>
                {formatter ? formatter(item.value) : item.value}
                {item.meta ? <small>{item.meta}</small> : null}
              </span>
            </div>
            <div className="dashboard-bar-track">
              <span
                className="dashboard-bar-fill"
                style={{
                  backgroundColor: item.color,
                  width: `${percent}%`,
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
