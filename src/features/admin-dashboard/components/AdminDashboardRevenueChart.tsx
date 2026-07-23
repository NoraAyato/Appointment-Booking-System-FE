import { Empty, Typography } from 'antd';
import dayjs from 'dayjs';

import type { AdminDashboardRevenuePoint } from '../types/admin-dashboard-type';

interface AdminDashboardRevenueChartProps {
  data: AdminDashboardRevenuePoint[];
  formatValue: (value: number) => string;
}

const CHART_WIDTH = 720;
const CHART_HEIGHT = 260;
const CHART_PADDING = 28;

const toPoint = (value: number, index: number, maxValue: number, total: number) => {
  const drawableWidth = CHART_WIDTH - CHART_PADDING * 2;
  const drawableHeight = CHART_HEIGHT - CHART_PADDING * 2;
  const x =
    CHART_PADDING + (total <= 1 ? drawableWidth / 2 : (index / (total - 1)) * drawableWidth);
  const y = CHART_PADDING + drawableHeight - (value / maxValue) * drawableHeight;

  return { x, y };
};

export function AdminDashboardRevenueChart({
  data,
  formatValue,
}: AdminDashboardRevenueChartProps) {
  if (!data.length) {
    return <Empty description="Chưa có dữ liệu doanh thu" />;
  }

  const maxRevenue = Math.max(...data.map((item) => item.revenue), 1);
  const points = data.map((item, index) =>
    toPoint(item.revenue, index, maxRevenue, data.length),
  );
  const linePath = points
    .map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`)
    .join(' ');
  const areaPath = `${linePath} L ${points.at(-1)?.x ?? CHART_PADDING} ${
    CHART_HEIGHT - CHART_PADDING
  } L ${points[0]?.x ?? CHART_PADDING} ${CHART_HEIGHT - CHART_PADDING} Z`;
  const totalRevenue = data.reduce((total, item) => total + item.revenue, 0);
  const invoiceCount = data.reduce((total, item) => total + item.invoiceCount, 0);

  return (
    <div className="admin-dashboard-revenue-chart">
      <div className="admin-dashboard-chart-summary">
        <div>
          <Typography.Text className="!text-sm !text-slate-500">Doanh thu</Typography.Text>
          <Typography.Title level={3} className="!mb-0 !mt-1">
            {formatValue(totalRevenue)}
          </Typography.Title>
        </div>
        <div>
          <Typography.Text className="!text-sm !text-slate-500">Hóa đơn</Typography.Text>
          <Typography.Title level={4} className="!mb-0 !mt-1">
            {invoiceCount}
          </Typography.Title>
        </div>
      </div>

      <svg
        className="admin-dashboard-revenue-svg"
        viewBox={`0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`}
        role="img"
        aria-label="Biểu đồ doanh thu theo ngày"
      >
        <defs>
          <linearGradient id="adminRevenueArea" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#2f7d67" stopOpacity="0.28" />
            <stop offset="100%" stopColor="#2f7d67" stopOpacity="0.02" />
          </linearGradient>
        </defs>
        {[0, 1, 2, 3].map((line) => {
          const y = CHART_PADDING + ((CHART_HEIGHT - CHART_PADDING * 2) / 3) * line;

          return (
            <line
              key={line}
              x1={CHART_PADDING}
              x2={CHART_WIDTH - CHART_PADDING}
              y1={y}
              y2={y}
              className="admin-dashboard-chart-grid-line"
            />
          );
        })}
        <path d={areaPath} fill="url(#adminRevenueArea)" />
        <path d={linePath} className="admin-dashboard-revenue-line" fill="none" />
        {points.map((point, index) => (
          <g key={data[index].date}>
            <circle cx={point.x} cy={point.y} r="5" className="admin-dashboard-revenue-dot" />
            <text x={point.x} y={CHART_HEIGHT - 8} textAnchor="middle">
              {dayjs(data[index].date).format('DD/MM')}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}
