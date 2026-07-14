import { Card, Typography } from 'antd';
import type { ReactNode } from 'react';

interface DashboardSectionProps {
  actions?: ReactNode;
  children: ReactNode;
  description?: ReactNode;
  loading?: boolean;
  title: ReactNode;
}

export function DashboardSection({
  actions,
  children,
  description,
  loading,
  title,
}: DashboardSectionProps) {
  return (
    <Card className="dashboard-section" loading={loading}>
      <div className="dashboard-section-header">
        <div className="min-w-0">
          <Typography.Title level={4} className="!mb-1 !mt-0 !text-ink">
            {title}
          </Typography.Title>
          {description ? (
            <Typography.Text className="!text-sm !text-slate-500">{description}</Typography.Text>
          ) : null}
        </div>
        {actions ? <div className="dashboard-section-actions">{actions}</div> : null}
      </div>
      <div className="mt-5">{children}</div>
    </Card>
  );
}
