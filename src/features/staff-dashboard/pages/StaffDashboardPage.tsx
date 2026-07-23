import {
  CalendarOutlined,
  CheckCircleOutlined,
  FieldTimeOutlined,
  LockOutlined,
  ScheduleOutlined,
} from '@ant-design/icons';
import { Col, Row, Space, Tag, Typography, notification } from 'antd';
import dayjs from 'dayjs';
import type { Dayjs } from 'dayjs';
import { useCallback, useEffect, useMemo, useState } from 'react';

import { DashboardMetricCard } from '@/features/dashboard/components/DashboardMetricCard';
import { DashboardPage } from '@/features/dashboard/components/DashboardPage';
import { DashboardSection } from '@/features/dashboard/components/DashboardSection';
import { DashboardTabs } from '@/features/dashboard/components/DashboardTabs';
import type { ApiResponse } from '@/shared/types/api-type';
import { getApiErrorMessage } from '@/shared/utils/api-error';
import {
  formatDate as formatDisplayDate,
  formatTimeRange as formatDisplayTimeRange,
} from '@/shared/utils/date-format';

import { staffDashboardRoleStaffApi } from '../api/staff-dashboard-api';
import { StaffDashboardStatusPanel } from '../components/StaffDashboardStatusPanel';
import { StaffScheduleBoard } from '../components/StaffScheduleBoard';
import { StaffWeekNavigator } from '../components/StaffWeekNavigator';
import {
  STAFF_CONFIRMED_APPOINTMENT_STATUS,
  emptyStaffDashboardOverview,
  getStaffAppointmentStatusMeta,
  getStaffApprovalStatusMeta,
  staffScheduleEventMeta,
} from '../constants/staff-dashboard-options';
import type {
  StaffDashboardOverview,
  StaffScheduleEvent,
} from '../types/staff-dashboard-type';

type StaffWeekRange = [Dayjs, Dayjs];

const getWeekRange = (date = dayjs()): StaffWeekRange => {
  const dayOfWeek = date.day();
  const diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  const startDate = date.startOf('day').add(diffToMonday, 'day');

  return [startDate, startDate.add(6, 'day')];
};

const getWeekOfMonth = (date: Dayjs) => {
  const firstDateOfMonth = date.startOf('month');
  const firstDayOfWeek = firstDateOfMonth.day();
  const mondayBasedOffset = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1;

  return Math.ceil((date.date() + mondayBasedOffset) / 7);
};

const getWeekPeriodLabel = (weekRange: StaffWeekRange) => {
  const currentWeekRange = getWeekRange();
  const referenceDate = weekRange[0].add(3, 'day');
  const monthNumber = referenceDate.month() + 1;

  if (weekRange[0].isSame(currentWeekRange[0], 'day')) {
    return `Tuần hiện tại tháng ${monthNumber}`;
  }

  return `Tuần ${getWeekOfMonth(referenceDate)} tháng ${monthNumber}`;
};

const getResponseData = <DataType,>(
  response: ApiResponse<DataType>,
  fallbackMessage: string,
) => {
  if (!response.success) {
    throw new Error(response.message || fallbackMessage);
  }

  return response.data;
};

const getEventTimestamp = (event: StaffScheduleEvent) =>
  dayjs(`${event.date}T${event.startTime || '00:00:00'}`).valueOf();

const isConfirmedUpcomingAppointment = (event: StaffScheduleEvent) =>
  event.type === 'APPOINTMENT' &&
  event.status === STAFF_CONFIRMED_APPOINTMENT_STATUS &&
  getEventTimestamp(event) >= dayjs().valueOf();

export function StaffDashboardPage() {
  const [toast, toastContextHolder] = notification.useNotification();
  const [weekRange, setWeekRange] = useState<StaffWeekRange>(() => getWeekRange());
  const [overview, setOverview] = useState<StaffDashboardOverview>(emptyStaffDashboardOverview);
  const [scheduleEvents, setScheduleEvents] = useState<StaffScheduleEvent[]>([]);
  const [dashboardLoading, setDashboardLoading] = useState(false);
  const [dashboardLoaded, setDashboardLoaded] = useState(false);

  const weekRangeParams = useMemo(
    () => ({
      fromDate: weekRange[0].format('YYYY-MM-DD'),
      toDate: weekRange[1].format('YYYY-MM-DD'),
    }),
    [weekRange],
  );

  const weekPeriodLabel = useMemo(() => getWeekPeriodLabel(weekRange), [weekRange]);
  const isInitialDashboardLoading = dashboardLoading && !dashboardLoaded;

  const upcomingEvents = useMemo(
    () =>
      scheduleEvents
        .filter(isConfirmedUpcomingAppointment)
        .sort((first, second) => getEventTimestamp(first) - getEventTimestamp(second))
        .slice(0, 5),
    [scheduleEvents],
  );

  const fetchDashboard = useCallback(async () => {
    setDashboardLoading(true);

    try {
      const [overviewResponse, scheduleResponse] = await Promise.all([
        staffDashboardRoleStaffApi.getOverview(weekRangeParams),
        staffDashboardRoleStaffApi.getSchedule(weekRangeParams),
      ]);

      setOverview(getResponseData(overviewResponse, 'Không thể tải tổng quan công việc.'));
      setScheduleEvents(getResponseData(scheduleResponse, 'Không thể tải lịch biểu nhân viên.'));
    } catch (error) {
      toast.error({
        message: 'Không thể tải tổng quan công việc',
        description: getApiErrorMessage(error, 'Vui lòng thử lại sau.'),
        placement: 'topRight',
      });
    } finally {
      setDashboardLoading(false);
      setDashboardLoaded(true);
    }
  }, [toast, weekRangeParams]);

  useEffect(() => {
    void fetchDashboard();
  }, [fetchDashboard]);

  const moveWeek = (weekOffset: number) => {
    setWeekRange(([startDate]) => getWeekRange(startDate.add(weekOffset, 'week')));
  };

  const goToCurrentWeek = () => {
    setWeekRange(getWeekRange());
  };

  const metricCards = (
    <Row gutter={[16, 16]}>
      <Col xs={24} sm={12} xl={6}>
        <DashboardMetricCard
          icon={<CalendarOutlined />}
          label="Tổng lịch hẹn"
          value={overview.totalAppointments}
        />
      </Col>
      <Col xs={24} sm={12} xl={6}>
        <DashboardMetricCard
          icon={<CheckCircleOutlined />}
          label="Hoàn tất"
          tone="green"
          value={overview.completedAppointments}
        />
      </Col>
      <Col xs={24} sm={12} xl={6}>
        <DashboardMetricCard
          icon={<FieldTimeOutlined />}
          label="Giờ làm"
          tone="amber"
          value={`${overview.totalWorkingHours}h`}
        />
      </Col>
      <Col xs={24} sm={12} xl={6}>
        <DashboardMetricCard
          icon={<LockOutlined />}
          label="Số lần nghỉ"
          tone="danger"
          value={overview.totalBlockedSlots}
        />
      </Col>
    </Row>
  );

  const upcomingSchedule = (
    <div className="staff-dashboard-upcoming-list">
      {upcomingEvents.length ? (
        upcomingEvents.map((event) => {
          const meta = staffScheduleEventMeta[event.type];
          const statusMeta =
            event.type === 'APPOINTMENT'
              ? getStaffAppointmentStatusMeta(event.status)
              : getStaffApprovalStatusMeta(event.status);

          return (
            <article key={`${event.type}-${getEventTimestamp(event)}-${event.title}`}>
              <span style={{ background: meta.color }} />
              <div>
                <Typography.Text strong>{event.title || meta.label}</Typography.Text>
                <Typography.Text className="block !text-xs !text-slate-500">
                  {formatDisplayDate(event.date, 'Mọi ngày')} ·{' '}
                  {formatDisplayTimeRange(event.startTime, event.endTime, 'Cả ngày')}
                </Typography.Text>
              </div>
              <Tag className="!m-0" color={statusMeta.color}>
                {statusMeta.label}
              </Tag>
            </article>
          );
        })
      ) : (
        <div className="staff-dashboard-empty-note">Chưa có lịch hẹn đã xác nhận sắp tới.</div>
      )}
    </div>
  );

  const weekNavigator = (
    <StaffWeekNavigator
      loading={dashboardLoading}
      periodLabel={weekPeriodLabel}
      weekRange={weekRange}
      onCurrentWeek={goToCurrentWeek}
      onNextWeek={() => moveWeek(1)}
      onPreviousWeek={() => moveWeek(-1)}
      onReload={() => void fetchDashboard()}
    />
  );

  return (
    <DashboardPage
      title="Tổng quan công việc"
      description="Theo dõi lịch biểu tuần và trạng thái vận hành cá nhân."
      actions={weekNavigator}
    >
      {toastContextHolder}

      <DashboardTabs
        items={[
          {
            key: 'overview',
            label: (
              <span className="dashboard-tab-label">
                <ScheduleOutlined /> Tổng quan
              </span>
            ),
            children: (
              <div className="dashboard-tab-panel">
                {metricCards}

                <Row gutter={[16, 16]} className="mt-4">
                  <Col xs={24} xl={16}>
                    <DashboardSection
                      title="Lịch biểu tuần"
                      description="Tuần được tính từ thứ hai đến chủ nhật."
                      loading={isInitialDashboardLoading}
                    >
                      <StaffScheduleBoard dateRange={weekRange} events={scheduleEvents} />
                    </DashboardSection>
                  </Col>
                  <Col xs={24} xl={8}>
                    <Space direction="vertical" size={16} className="w-full">
                      <DashboardSection
                        title="Trạng thái lịch hẹn"
                        loading={isInitialDashboardLoading}
                      >
                        <StaffDashboardStatusPanel overview={overview} />
                      </DashboardSection>
                      <DashboardSection
                        title="Lịch sắp tới"
                        loading={isInitialDashboardLoading}
                      >
                        {upcomingSchedule}
                      </DashboardSection>
                    </Space>
                  </Col>
                </Row>
              </div>
            ),
          },
          {
            key: 'schedule',
            label: (
              <span className="dashboard-tab-label">
                <CalendarOutlined /> Lịch biểu
              </span>
            ),
            children: (
              <div className="dashboard-tab-panel">
                <DashboardSection
                  title="Calendar làm việc"
                  description="Bao gồm ca làm, lịch hẹn đã xác nhận và các khoảng xin nghỉ đã áp dụng."
                  loading={isInitialDashboardLoading}
                >
                  <StaffScheduleBoard dateRange={weekRange} events={scheduleEvents} />
                </DashboardSection>
              </div>
            ),
          },
        ]}
      />
    </DashboardPage>
  );
}
