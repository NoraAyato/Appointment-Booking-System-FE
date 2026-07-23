import { Typography } from 'antd';
import type { ReactNode } from 'react';

interface DashboardPageProps {
  actions?: ReactNode;
  bodyClassName?: string;
  children: ReactNode;
  className?: string;
  description?: ReactNode;
  title: ReactNode;
}

export function DashboardPage({
  actions,
  bodyClassName = 'mt-6',
  children,
  className,
  description,
  title,
}: DashboardPageProps) {
  return (
    <section className={className}>
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div>
          <Typography.Title level={2} className="!mb-1">
            {title}
          </Typography.Title>
          {description ? (
            <Typography.Text className="text-slate-500">{description}</Typography.Text>
          ) : null}
        </div>
        {actions ? <div className="flex shrink-0 items-center gap-2">{actions}</div> : null}
      </div>

      <div className={bodyClassName}>{children}</div>
    </section>
  );
}