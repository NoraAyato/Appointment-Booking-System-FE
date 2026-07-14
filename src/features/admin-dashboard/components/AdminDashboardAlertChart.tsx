import {
  FieldTimeOutlined,
  PieChartOutlined,
  StarFilled,
  TeamOutlined,
  UserSwitchOutlined,
} from '@ant-design/icons';
import { Tag, Typography } from 'antd';
import type { ReactNode } from 'react';

import type { AdminDashboardAlerts } from '../types/admin-dashboard-type';

interface AdminDashboardAlertChartProps {
  alerts: AdminDashboardAlerts;
}

interface AlertChartItem {
  color: string;
  icon: ReactNode;
  label: string;
  value: number;
}

const getAlertTone = (value: number) => {
  if (value >= 4) {
    return 'high';
  }

  if (value >= 2) {
    return 'medium';
  }

  return 'low';
};

export function AdminDashboardAlertChart({ alerts }: AdminDashboardAlertChartProps) {
  const items: AlertChartItem[] = [
    {
      color: '#d99530',
      icon: <UserSwitchOutlined />,
      label: 'Ca chờ duyệt',
      value: alerts.pendingStaffShifts,
    },
    {
      color: '#0ea5e9',
      icon: <FieldTimeOutlined />,
      label: 'Khóa lịch',
      value: alerts.pendingBlockedSlots,
    },
    {
      color: '#8b5cf6',
      icon: <StarFilled />,
      label: 'Review',
      value: alerts.pendingReviews,
    },
    {
      color: '#de7d62',
      icon: <PieChartOutlined />,
      label: 'DV chưa phân công',
      value: alerts.servicesWithoutStaff,
    },
    {
      color: '#2f7d67',
      icon: <TeamOutlined />,
      label: 'NV chưa có ca',
      value: alerts.staffWithoutShiftToday,
    },
  ];
  const maxValue = Math.max(...items.map((item) => item.value), 1);
  const totalAlerts = items.reduce((total, item) => total + item.value, 0);

  return (
    <div className="admin-dashboard-alert-chart">
      <div className="admin-dashboard-alert-board-header">
        <div>
          <Typography.Text className="!text-sm !text-slate-500">Tổng cảnh báo</Typography.Text>
          <Typography.Title level={3} className="!mb-0 !mt-1">
            {totalAlerts}
          </Typography.Title>
        </div>
        <Tag color={totalAlerts > 0 ? 'warning' : 'success'} className="!m-0">
          {totalAlerts > 0 ? 'Cần theo dõi' : 'Ổn định'}
        </Tag>
      </div>

      <div className="admin-dashboard-alert-card-grid">
        {items.map((item) => {
          const progress = Math.max(6, Math.round((item.value / maxValue) * 100));
          const tone = getAlertTone(item.value);

          return (
            <div key={item.label} className={`admin-dashboard-alert-card ${tone}`}>
              <div className="admin-dashboard-alert-card-top">
                <span className="admin-dashboard-alert-card-icon" style={{ color: item.color }}>
                  {item.icon}
                </span>
                <Tag className="!m-0" color={item.value > 0 ? 'warning' : 'success'}>
                  {item.value > 0 ? 'Cần xử lý' : 'Ổn định'}
                </Tag>
              </div>
              <Typography.Title level={3} className="!mb-0 !mt-0">
                {item.value}
              </Typography.Title>
              <Typography.Text className="!text-slate-500">{item.label}</Typography.Text>
              <div className="admin-dashboard-alert-progress">
                <span
                  style={{
                    backgroundColor: item.color,
                    width: `${progress}%`,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
