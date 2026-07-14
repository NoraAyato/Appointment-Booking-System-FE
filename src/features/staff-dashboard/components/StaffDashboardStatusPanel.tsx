import { Typography } from 'antd';
import type { CSSProperties } from 'react';

import type { StaffDashboardOverview } from '../types/staff-dashboard-type';

interface StaffDashboardStatusPanelProps {
  overview: StaffDashboardOverview;
}

const statusRows = [
  {
    color: '#D99530',
    key: 'pendingAppointments',
    label: 'Chờ xác nhận',
  },
  {
    color: '#0EA5E9',
    key: 'confirmedAppointments',
    label: 'Đã xác nhận',
  },
  {
    color: '#2F7D67',
    key: 'completedAppointments',
    label: 'Hoàn tất',
  },
  {
    color: '#DE7D62',
    key: 'cancelledAppointments',
    label: 'Đã hủy',
  },
] as const;

export function StaffDashboardStatusPanel({ overview }: StaffDashboardStatusPanelProps) {
  const total = Math.max(overview.totalAppointments, 1);

  return (
    <div className="staff-dashboard-status-panel">
      <div className="staff-dashboard-status-ring">
        <strong>{overview.totalAppointments}</strong>
        <span>Lịch hẹn</span>
      </div>

      <div className="staff-dashboard-status-list">
        {statusRows.map((row) => {
          const count = overview[row.key];
          const percentage = Math.round((count / total) * 100);

          return (
            <div key={row.key} className="staff-dashboard-status-row">
              <div className="staff-dashboard-status-row-top">
                <Typography.Text strong>{row.label}</Typography.Text>
                <span>{count}</span>
              </div>
              <div className="staff-dashboard-status-track">
                <span
                  style={
                    {
                      '--status-color': row.color,
                      width: `${percentage}%`,
                    } as CSSProperties
                  }
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
