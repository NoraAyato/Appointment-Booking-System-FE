import {
  CalendarOutlined,
  LeftOutlined,
  ReloadOutlined,
  RightOutlined,
} from '@ant-design/icons';
import { Button, Space, Typography } from 'antd';
import type { Dayjs } from 'dayjs';

interface StaffWeekNavigatorProps {
  loading?: boolean;
  onCurrentWeek: () => void;
  onNextWeek: () => void;
  onPreviousWeek: () => void;
  onReload: () => void;
  periodLabel: string;
  weekRange: [Dayjs, Dayjs];
}

export function StaffWeekNavigator({
  loading,
  onCurrentWeek,
  onNextWeek,
  onPreviousWeek,
  onReload,
  periodLabel,
  weekRange,
}: StaffWeekNavigatorProps) {
  return (
    <div className="staff-week-navigator">
      <Space size={8} wrap>
        <Button
          aria-label="Tuần trước"
          disabled={loading}
          icon={<LeftOutlined />}
          onClick={onPreviousWeek}
        />
        <Button disabled={loading} icon={<CalendarOutlined />} onClick={onCurrentWeek}>
          Tuần hiện tại
        </Button>
        <Button
          aria-label="Tuần sau"
          disabled={loading}
          icon={<RightOutlined />}
          onClick={onNextWeek}
        />
      </Space>

      <Typography.Text className="staff-week-navigator-range">
        <strong>{periodLabel}</strong>
        <small>
          {weekRange[0].format('DD/MM/YYYY')} - {weekRange[1].format('DD/MM/YYYY')}
        </small>
      </Typography.Text>

      <Button icon={<ReloadOutlined />} loading={loading} onClick={onReload}>
        Tải lại
      </Button>
      {loading ? (
        <Typography.Text className="staff-week-navigator-refreshing">
          Đang cập nhật
        </Typography.Text>
      ) : null}
    </div>
  );
}
