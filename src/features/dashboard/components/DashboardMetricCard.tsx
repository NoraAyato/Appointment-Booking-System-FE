import { Card, Typography } from 'antd';
import type { ReactNode } from 'react';

interface DashboardMetricCardProps {
  icon: ReactNode;
  label: string;
  tone?: 'amber' | 'blue' | 'danger' | 'green' | 'neutral';
  value: ReactNode;
}

export function DashboardMetricCard({
  icon,
  label,
  tone = 'green',
  value,
}: DashboardMetricCardProps) {
  return (
    <Card className="dashboard-metric-card">
      <div className="flex items-center gap-3">
        <span className={`dashboard-metric-icon ${tone}`}>{icon}</span>
        <div className="min-w-0">
          <Typography.Text className="block !text-sm !text-slate-500">{label}</Typography.Text>
          <Typography.Title level={3} className="!mb-0 !mt-0 !text-ink">
            {value}
          </Typography.Title>
        </div>
      </div>
    </Card>
  );
}
