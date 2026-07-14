import { Empty, Typography } from 'antd';

import type {
  AdminDashboardAppointmentStatus,
  AdminDashboardAppointmentStatusSummary,
} from '../types/admin-dashboard-type';

interface AdminDashboardStatusDonutChartProps {
  colors: Record<AdminDashboardAppointmentStatus, string>;
  data: AdminDashboardAppointmentStatusSummary[];
  labels: Record<AdminDashboardAppointmentStatus, string>;
}

const toConicGradient = (
  data: AdminDashboardAppointmentStatusSummary[],
  colors: Record<AdminDashboardAppointmentStatus, string>,
) => {
  const total = data.reduce((sum, item) => sum + item.count, 0);
  let cursor = 0;

  return data
    .map((item) => {
      const start = cursor;
      const end = total ? cursor + (item.count / total) * 100 : cursor;

      cursor = end;

      return `${colors[item.status]} ${start}% ${end}%`;
    })
    .join(', ');
};

export function AdminDashboardStatusDonutChart({
  colors,
  data,
  labels,
}: AdminDashboardStatusDonutChartProps) {
  const total = data.reduce((sum, item) => sum + item.count, 0);

  if (!data.length) {
    return <Empty description="Chưa có dữ liệu trạng thái" />;
  }

  return (
    <div className="admin-dashboard-status-chart">
      <div
        className="admin-dashboard-status-donut"
        style={{
          background: total ? `conic-gradient(${toConicGradient(data, colors)})` : '#e2e8f0',
        }}
      >
        <div>
          <strong>{total}</strong>
          <span>lịch hẹn</span>
        </div>
      </div>

      <div className="admin-dashboard-status-legend">
        {data.map((item) => {
          const percentage = total ? Math.round((item.count / total) * 100) : 0;

          return (
            <div key={item.status}>
              <span style={{ backgroundColor: colors[item.status] }} />
              <Typography.Text>{labels[item.status]}</Typography.Text>
              <strong>{percentage}%</strong>
              <small>{item.count}</small>
            </div>
          );
        })}
      </div>
    </div>
  );
}
