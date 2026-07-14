import {
  AlertOutlined,
  CalendarOutlined,
  CheckCircleOutlined,
  DollarOutlined,
  LineChartOutlined,
  StarFilled,
  TeamOutlined,
} from '@ant-design/icons';
import { Avatar, Col, DatePicker, Row, Space, Tag, Typography, notification } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import type { Dayjs } from 'dayjs';
import { useCallback, useEffect, useMemo, useState } from 'react';

import { AppSelect } from '@/shared/components/AppSelect';
import { DataTable } from '@/shared/components/DataTable';
import type { ApiResponse } from '@/shared/types/api-type';
import { getApiErrorMessage } from '@/shared/utils/api-error';
import { getAvatarInitial } from '@/shared/utils/avatar';
import { formatAppointmentDateTimeRange } from '@/shared/utils/date-format';
import { DashboardBarList } from '@/features/dashboard/components/DashboardBarList';
import { DashboardMetricCard } from '@/features/dashboard/components/DashboardMetricCard';
import { DashboardPage } from '@/features/dashboard/components/DashboardPage';
import { DashboardSection } from '@/features/dashboard/components/DashboardSection';
import { DashboardTabs } from '@/features/dashboard/components/DashboardTabs';

import { adminDashboardRoleAdminApi } from '../api/admin-dashboard-api';
import { AdminDashboardAlertChart } from '../components/AdminDashboardAlertChart';
import { AdminDashboardRevenueChart } from '../components/AdminDashboardRevenueChart';
import { AdminDashboardStatusDonutChart } from '../components/AdminDashboardStatusDonutChart';
import {
  adminDashboardLimitOptions,
  appointmentStatusColors,
  appointmentStatusLabels,
  emptyAdminDashboardAlerts,
} from '../constants/admin-dashboard-options';
import type {
  AdminDashboardAlerts,
  AdminDashboardAppointmentDaily,
  AdminDashboardAppointmentStatus,
  AdminDashboardAppointmentStatusSummary,
  AdminDashboardRevenuePoint,
  AdminDashboardStaffPerformance,
  AdminDashboardTopService,
  AdminDashboardUpcomingAppointment,
} from '../types/admin-dashboard-type';

const { RangePicker } = DatePicker;

type DashboardDateRange = [Dayjs, Dayjs];

const formatCurrency = (value: number) =>
  value.toLocaleString('vi-VN', {
    currency: 'VND',
    maximumFractionDigits: 0,
    style: 'currency',
  });

const formatCompactCurrency = (value: number) => {
  if (value >= 1_000_000) {
    return `${(value / 1_000_000).toLocaleString('vi-VN', {
      maximumFractionDigits: 1,
    })}M`;
  }

  return `${value.toLocaleString('vi-VN')}đ`;
};

const getStatusColor = (status: string) =>
  appointmentStatusColors[status as AdminDashboardAppointmentStatus] ?? '#64748B';

const getStatusLabel = (status: string) =>
  appointmentStatusLabels[status as AdminDashboardAppointmentStatus] ?? status;

const getStatusCount = (
  items: AdminDashboardAppointmentStatusSummary[],
  status: AdminDashboardAppointmentStatus,
) => items.find((item) => item.status === status)?.count ?? 0;

const getResponseData = <DataType,>(
  response: ApiResponse<DataType>,
  fallbackMessage: string,
) => {
  if (!response.success) {
    throw new Error(response.message || fallbackMessage);
  }

  return response.data;
};

export function AdminDashboardPage() {
  const [toast, toastContextHolder] = notification.useNotification();
  const [dateRange, setDateRange] = useState<DashboardDateRange>([
    dayjs().subtract(6, 'day'),
    dayjs(),
  ]);
  const [staffLimit, setStaffLimit] = useState(5);
  const [serviceLimit, setServiceLimit] = useState(5);
  const [upcomingLimit, setUpcomingLimit] = useState(5);
  const [appointmentStatusSummary, setAppointmentStatusSummary] = useState<
    AdminDashboardAppointmentStatusSummary[]
  >([]);
  const [appointmentDaily, setAppointmentDaily] = useState<AdminDashboardAppointmentDaily[]>([]);
  const [revenueData, setRevenueData] = useState<AdminDashboardRevenuePoint[]>([]);
  const [topServices, setTopServices] = useState<AdminDashboardTopService[]>([]);
  const [staffPerformance, setStaffPerformance] = useState<AdminDashboardStaffPerformance[]>([]);
  const [upcomingAppointments, setUpcomingAppointments] = useState<
    AdminDashboardUpcomingAppointment[]
  >([]);
  const [alerts, setAlerts] = useState<AdminDashboardAlerts>(emptyAdminDashboardAlerts);
  const [analyticsLoading, setAnalyticsLoading] = useState(false);
  const [alertsLoading, setAlertsLoading] = useState(false);
  const [upcomingLoading, setUpcomingLoading] = useState(false);

  const dateRangeParams = useMemo(
    () => ({
      fromDate: dateRange[0].format('YYYY-MM-DD'),
      toDate: dateRange[1].format('YYYY-MM-DD'),
    }),
    [dateRange],
  );

  const dashboardOverview = useMemo(() => {
    const totalAppointments = appointmentStatusSummary.reduce(
      (total, item) => total + item.count,
      0,
    );
    const totalRevenue = revenueData.reduce((total, item) => total + item.revenue, 0);
    const paidInvoices = revenueData.reduce((total, item) => total + item.invoiceCount, 0);
    const ratingValues = [
      ...topServices.map((service) => service.averageRating),
      ...staffPerformance.map((staff) => staff.averageRating),
    ].filter((rating) => rating > 0);
    const averageRating = ratingValues.length
      ? ratingValues.reduce((total, rating) => total + rating, 0) / ratingValues.length
      : 0;

    return {
      activeServices: topServices.length,
      activeStaff: staffPerformance.length,
      averageRating,
      cancelledAppointments: getStatusCount(appointmentStatusSummary, 'CANCELLED'),
      completedAppointments: getStatusCount(appointmentStatusSummary, 'COMPLETED'),
      confirmedAppointments: getStatusCount(appointmentStatusSummary, 'CONFIRMED'),
      paidInvoices,
      pendingAppointments: getStatusCount(appointmentStatusSummary, 'PENDING'),
      pendingReviews: alerts.pendingReviews,
      totalAppointments,
      totalRevenue,
      upcomingAppointments: upcomingAppointments.length,
    };
  }, [
    alerts.pendingReviews,
    appointmentStatusSummary,
    revenueData,
    staffPerformance,
    topServices,
    upcomingAppointments.length,
  ]);

  const fetchAnalytics = useCallback(async () => {
    setAnalyticsLoading(true);

    try {
      const [
        statusSummaryResponse,
        appointmentDailyResponse,
        revenueResponse,
        topServicesResponse,
        staffPerformanceResponse,
      ] = await Promise.all([
        adminDashboardRoleAdminApi.getAppointmentStatusSummary(dateRangeParams),
        adminDashboardRoleAdminApi.getAppointmentDaily(dateRangeParams),
        adminDashboardRoleAdminApi.getRevenue(dateRangeParams),
        adminDashboardRoleAdminApi.getTopServices({
          ...dateRangeParams,
          limit: serviceLimit,
        }),
        adminDashboardRoleAdminApi.getStaffPerformance({
          ...dateRangeParams,
          limit: staffLimit,
        }),
      ]);

      setAppointmentStatusSummary(
        getResponseData(statusSummaryResponse, 'Không thể tải trạng thái lịch hẹn.'),
      );
      setAppointmentDaily(
        getResponseData(appointmentDailyResponse, 'Không thể tải lịch hẹn theo ngày.'),
      );
      setRevenueData(getResponseData(revenueResponse, 'Không thể tải doanh thu.'));
      setTopServices(getResponseData(topServicesResponse, 'Không thể tải top dịch vụ.'));
      setStaffPerformance(
        getResponseData(staffPerformanceResponse, 'Không thể tải hiệu suất nhân viên.'),
      );
    } catch (error) {
      toast.error({
        message: 'Không thể tải thống kê dashboard',
        description: getApiErrorMessage(error, 'Vui lòng thử lại sau.'),
        placement: 'topRight',
      });
    } finally {
      setAnalyticsLoading(false);
    }
  }, [dateRangeParams, serviceLimit, staffLimit, toast]);

  const fetchAlerts = useCallback(async () => {
    setAlertsLoading(true);

    try {
      const response = await adminDashboardRoleAdminApi.getAlerts();

      setAlerts(getResponseData(response, 'Không thể tải cảnh báo vận hành.'));
    } catch (error) {
      toast.error({
        message: 'Không thể tải cảnh báo vận hành',
        description: getApiErrorMessage(error, 'Vui lòng thử lại sau.'),
        placement: 'topRight',
      });
    } finally {
      setAlertsLoading(false);
    }
  }, [toast]);

  const fetchUpcomingAppointments = useCallback(async () => {
    setUpcomingLoading(true);

    try {
      const response = await adminDashboardRoleAdminApi.getUpcomingAppointments({
        limit: upcomingLimit,
      });

      setUpcomingAppointments(
        getResponseData(response, 'Không thể tải lịch hẹn sắp tới.'),
      );
    } catch (error) {
      toast.error({
        message: 'Không thể tải lịch hẹn sắp tới',
        description: getApiErrorMessage(error, 'Vui lòng thử lại sau.'),
        placement: 'topRight',
      });
    } finally {
      setUpcomingLoading(false);
    }
  }, [toast, upcomingLimit]);

  useEffect(() => {
    void fetchAnalytics();
  }, [fetchAnalytics]);

  useEffect(() => {
    void fetchAlerts();
  }, [fetchAlerts]);

  useEffect(() => {
    void fetchUpcomingAppointments();
  }, [fetchUpcomingAppointments]);

  const handleDateRangeChange = (value: null | [Dayjs | null, Dayjs | null]) => {
    if (!value?.[0] || !value[1]) {
      return;
    }

    setDateRange([value[0], value[1]]);
  };

  const staffColumns: ColumnsType<AdminDashboardStaffPerformance> = [
    {
      title: 'Nhân viên',
      dataIndex: 'staffName',
      render: (staffName: string) => (
        <Space>
          <Avatar>{getAvatarInitial(staffName)}</Avatar>
          <Typography.Text strong>{staffName}</Typography.Text>
        </Space>
      ),
    },
    {
      title: 'Hoàn tất',
      dataIndex: 'completedAppointments',
      width: 110,
    },
    {
      title: 'Đã hủy',
      dataIndex: 'cancelledAppointments',
      width: 100,
    },
    {
      title: 'Đánh giá',
      dataIndex: 'averageRating',
      width: 120,
      render: (rating: number) => (
        <span className="admin-dashboard-rating">
          <StarFilled /> {rating.toFixed(1)}
        </span>
      ),
    },
    {
      title: 'Giờ làm',
      dataIndex: 'totalWorkingHours',
      width: 110,
      render: (hours: number) => `${hours} giờ`,
    },
  ];

  const serviceColumns: ColumnsType<AdminDashboardTopService> = [
    {
      title: 'Dịch vụ',
      dataIndex: 'serviceName',
      render: (serviceName: string) => <Typography.Text strong>{serviceName}</Typography.Text>,
    },
    {
      title: 'Lượt đặt',
      dataIndex: 'bookingCount',
      width: 110,
    },
    {
      title: 'Doanh thu',
      dataIndex: 'revenue',
      width: 140,
      render: (revenue: number) => formatCurrency(revenue),
    },
    {
      title: 'Đánh giá',
      dataIndex: 'averageRating',
      width: 120,
      render: (rating: number) => (
        <span className="admin-dashboard-rating">
          <StarFilled /> {rating.toFixed(1)}
        </span>
      ),
    },
  ];

  const upcomingColumns: ColumnsType<AdminDashboardUpcomingAppointment> = [
    {
      title: 'Khách hàng',
      dataIndex: 'customerName',
      render: (customerName: string, record) => (
        <div>
          <Typography.Text strong>{customerName}</Typography.Text>
          <Typography.Text className="block !text-xs !text-slate-500">
            {record.serviceName}
          </Typography.Text>
        </div>
      ),
    },
    {
      title: 'Nhân viên',
      dataIndex: 'staffName',
      width: 150,
    },
    {
      title: 'Thời gian',
      dataIndex: 'startTime',
      width: 190,
      render: (startTime: string, record) =>
        formatAppointmentDateTimeRange(startTime, record.endTime, 'DD/MM HH:mm'),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      width: 140,
      render: (status: string) => (
        <Tag className="!m-0" color={getStatusColor(status)}>
          {getStatusLabel(status)}
        </Tag>
      ),
    },
  ];

  const metricCards = (
    <Row gutter={[16, 16]}>
      <Col xs={24} sm={12} xl={6}>
        <DashboardMetricCard
          icon={<CalendarOutlined />}
          label="Tổng lịch hẹn"
          value={dashboardOverview.totalAppointments}
        />
      </Col>
      <Col xs={24} sm={12} xl={6}>
        <DashboardMetricCard
          icon={<DollarOutlined />}
          label="Tổng doanh thu"
          tone="blue"
          value={formatCompactCurrency(dashboardOverview.totalRevenue)}
        />
      </Col>
      <Col xs={24} sm={12} xl={6}>
        <DashboardMetricCard
          icon={<CheckCircleOutlined />}
          label="Hóa đơn đã thanh toán"
          tone="amber"
          value={dashboardOverview.paidInvoices}
        />
      </Col>
      <Col xs={24} sm={12} xl={6}>
        <DashboardMetricCard
          icon={<StarFilled />}
          label="Đánh giá trung bình"
          tone="neutral"
          value={dashboardOverview.averageRating.toFixed(1)}
        />
      </Col>
    </Row>
  );

  const operationSummary = (
    <DashboardSection title="Vận hành hệ thống">
      <div className="admin-dashboard-operation-grid">
        <div>
          <CalendarOutlined />
          <Typography.Text className="!text-slate-500">Lịch sắp tới</Typography.Text>
          <Typography.Title level={4} className="!mb-0 !mt-0">
            {dashboardOverview.upcomingAppointments}
          </Typography.Title>
        </div>
        <div>
          <LineChartOutlined />
          <Typography.Text className="!text-slate-500">Dịch vụ trong top</Typography.Text>
          <Typography.Title level={4} className="!mb-0 !mt-0">
            {dashboardOverview.activeServices}
          </Typography.Title>
        </div>
        <div>
          <TeamOutlined />
          <Typography.Text className="!text-slate-500">Nhân viên có hiệu suất</Typography.Text>
          <Typography.Title level={4} className="!mb-0 !mt-0">
            {dashboardOverview.activeStaff}
          </Typography.Title>
        </div>
        <div>
          <AlertOutlined />
          <Typography.Text className="!text-slate-500">Review chờ duyệt</Typography.Text>
          <Typography.Title level={4} className="!mb-0 !mt-0">
            {dashboardOverview.pendingReviews}
          </Typography.Title>
        </div>
      </div>
    </DashboardSection>
  );

  return (
    <DashboardPage
      title="Tổng quan vận hành"
      actions={
        <RangePicker
          allowClear={false}
          format="DD/MM/YYYY"
          value={dateRange}
          onChange={handleDateRangeChange}
        />
      }
    >
      {toastContextHolder}
      <DashboardTabs
        items={[
          {
            key: 'overview',
            label: (
              <span className="dashboard-tab-label">
                <LineChartOutlined /> Tổng quan
              </span>
            ),
            children: (
              <div className="dashboard-tab-panel">
                {metricCards}
                <div className="mt-4">{operationSummary}</div>

                <Row gutter={[16, 16]} className="mt-4">
                  <Col xs={24} xl={14}>
                    <DashboardSection
                      title="Doanh thu theo ngày"
                      loading={analyticsLoading}
                    >
                      <AdminDashboardRevenueChart
                        data={revenueData}
                        formatValue={formatCompactCurrency}
                      />
                    </DashboardSection>
                  </Col>
                  <Col xs={24} xl={10}>
                    <DashboardSection
                      title="Trạng thái lịch hẹn"
                      loading={analyticsLoading}
                    >
                      <AdminDashboardStatusDonutChart
                        colors={appointmentStatusColors}
                        data={appointmentStatusSummary}
                        labels={appointmentStatusLabels}
                      />
                    </DashboardSection>
                  </Col>
                </Row>
              </div>
            ),
          },
          {
            key: 'appointments',
            label: (
              <span className="dashboard-tab-label">
                <CalendarOutlined /> Lịch hẹn
              </span>
            ),
            children: (
              <div className="dashboard-tab-panel">
                <Row gutter={[16, 16]}>
                  <Col xs={24} xl={10}>
                    <DashboardSection
                      title="Lịch hẹn theo ngày"
                      loading={analyticsLoading}
                    >
                      <DashboardBarList
                        items={appointmentDaily.map((item) => ({
                          label: dayjs(item.date).format('DD/MM'),
                          meta: `${item.completed} hoàn tất · ${item.cancelled} hủy`,
                          value: item.total,
                        }))}
                      />
                    </DashboardSection>
                  </Col>
                  <Col xs={24} xl={14}>
                    <DataTable<AdminDashboardUpcomingAppointment>
                      cardClassName="admin-dashboard-table-card"
                      rowKey="appointmentId"
                      title="Lịch hẹn sắp tới"
                      extra={
                        <AppSelect<number>
                          className="admin-dashboard-limit-select"
                          options={adminDashboardLimitOptions}
                          value={upcomingLimit}
                          onChange={setUpcomingLimit}
                        />
                      }
                      dataSource={upcomingAppointments}
                      columns={upcomingColumns}
                      loading={upcomingLoading}
                    />
                  </Col>
                </Row>
              </div>
            ),
          },
          {
            key: 'performance',
            label: (
              <span className="dashboard-tab-label">
                <TeamOutlined /> Hiệu suất
              </span>
            ),
            children: (
              <div className="dashboard-tab-panel">
                <Row gutter={[16, 16]}>
                  <Col xs={24} xl={12}>
                    <DataTable<AdminDashboardTopService>
                      cardClassName="admin-dashboard-table-card"
                      rowKey="serviceId"
                      title="Top dịch vụ"
                      extra={
                        <AppSelect<number>
                          className="admin-dashboard-limit-select"
                          options={adminDashboardLimitOptions}
                          value={serviceLimit}
                          onChange={setServiceLimit}
                        />
                      }
                      dataSource={topServices}
                      columns={serviceColumns}
                      loading={analyticsLoading}
                    />
                  </Col>
                  <Col xs={24} xl={12}>
                    <DataTable<AdminDashboardStaffPerformance>
                      cardClassName="admin-dashboard-table-card"
                      rowKey="staffId"
                      title="Hiệu suất nhân viên"
                      extra={
                        <AppSelect<number>
                          className="admin-dashboard-limit-select"
                          options={adminDashboardLimitOptions}
                          value={staffLimit}
                          onChange={setStaffLimit}
                        />
                      }
                      dataSource={staffPerformance}
                      columns={staffColumns}
                      loading={analyticsLoading}
                    />
                  </Col>
                </Row>
              </div>
            ),
          },
          {
            key: 'alerts',
            label: (
              <span className="dashboard-tab-label">
                <AlertOutlined /> Cảnh báo
              </span>
            ),
            children: (
              <div className="dashboard-tab-panel">
                <DashboardSection title="Cảnh báo vận hành" loading={alertsLoading}>
                  <AdminDashboardAlertChart alerts={alerts} />
                </DashboardSection>
              </div>
            ),
          },
        ]}
      />
    </DashboardPage>
  );
}
