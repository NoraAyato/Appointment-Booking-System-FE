import {
  CalendarOutlined,
  ClockCircleOutlined,
  CreditCardOutlined,
  FileTextOutlined,
  ReloadOutlined,
  StarOutlined,
  TeamOutlined,
} from '@ant-design/icons';
import {
  Avatar,
  Button,
  Card,
  Empty,
  Skeleton,
  Space,
  Tag,
  Typography,
  notification,
} from 'antd';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import fallbackServiceImage from '@/assets/appointment-hero.png';
import { AppPagination } from '@/shared/components/AppPagination';
import { getApiErrorMessage } from '@/shared/utils/api-error';
import { getAvatarInitial } from '@/shared/utils/avatar';
import { formatDate, formatTimeRange } from '@/shared/utils/date-format';

import { appointmentHistoryPaymentMethodLabels } from '../constants/appointment-history-display';
import { AppointmentReviewModal } from '../components/AppointmentReviewModal';
import { useAppointmentHistoryQuery } from '../hooks/useAppointmentHistoryQuery';
import type { AppointmentHistoryModel } from '../types/appointment-type';

const DEFAULT_BOOKING_HISTORY_PAGE_SIZE = 3;

const formatCurrency = (value?: number | null) =>
  `${Number(value ?? 0).toLocaleString('vi-VN')}đ`;

const getPaymentMethodLabel = (appointment: AppointmentHistoryModel) => {
  if (!appointment.paymentMethod) {
    return 'Chưa chọn';
  }

  return appointmentHistoryPaymentMethodLabels[appointment.paymentMethod] ?? appointment.paymentMethod;
};

function AppointmentHistorySkeleton() {
  return (
    <div className="grid gap-4">
      {Array.from({ length: DEFAULT_BOOKING_HISTORY_PAGE_SIZE }).map((_, index) => (
        <Card key={index} className="appointment-history-card">
          <Skeleton active avatar paragraph={{ rows: 4 }} />
        </Card>
      ))}
    </div>
  );
}

interface AppointmentHistoryCardProps {
  appointment: AppointmentHistoryModel;
  onPayInvoice: (invoiceId: string) => void;
  onReview: (appointment: AppointmentHistoryModel) => void;
}

function AppointmentHistoryCard({
  appointment,
  onPayInvoice,
  onReview,
}: AppointmentHistoryCardProps) {
  const isUnpaid = appointment.invoiceStatus === 'UNPAID';
  const isPaid = appointment.invoiceStatus === 'PAID';
  const canPayInvoice =
    isUnpaid && Boolean(appointment.invoiceId?.trim()) && appointment.appointmentStatus !== 'CANCELLED';
  const canReview = appointment.appointmentStatus === 'COMPLETED' && !appointment.reviewed;

  return (
    <Card className="appointment-history-card overflow-hidden">
      <div className="appointment-history-item">
        <div className="appointment-history-image-wrap">
          <img
            alt={appointment.serviceName}
            className="appointment-history-image"
            src={appointment.serviceImageUrl || fallbackServiceImage}
          />
          <Tag
            className="appointment-history-category"
            color={appointment.categoryColorTag || 'default'}
          >
            {appointment.categoryName}
          </Tag>
        </div>

        <div className="appointment-history-content">
          <div className="appointment-history-heading">
            <div className="min-w-0">
              {isUnpaid ? (
                <Space size={8} wrap className="mb-2">
                  <Tag color="orange">Chưa thanh toán</Tag>
                </Space>
              ) : null}
              {isPaid ? (
                <Space size={8} wrap className="mb-2">
                  <Tag color="green">Đã thanh toán</Tag>
                </Space>
              ) : null}
              <Typography.Title level={4} className="!mb-1 !text-ink">
                {appointment.serviceName}
              </Typography.Title>
              <Typography.Text className="block !text-sm !text-slate-500">
                Mã lịch: {appointment.appointmentId}
              </Typography.Text>
            </div>
          </div>

          <div className="appointment-history-meta-grid">
            <div>
              <CalendarOutlined />
              <span>{formatDate(appointment.bookingDate)}</span>
            </div>
            <div>
              <ClockCircleOutlined />
              <span>
                {formatTimeRange(appointment.startTime, appointment.endTime)} ·{' '}
                {appointment.durationMinutes} phút
              </span>
            </div>
            <div>
              <TeamOutlined />
              <span>{appointment.quantity} khách</span>
            </div>
            <div>
              <CreditCardOutlined />
              <span>{getPaymentMethodLabel(appointment)}</span>
            </div>
          </div>

          <div className="appointment-history-staff-row">
            <Space size={12}>
              <Avatar size={42} src={appointment.staffAvatarUrl}>
                {getAvatarInitial(appointment.staffName)}
              </Avatar>
              <div>
                <Typography.Text className="block !text-xs !font-semibold uppercase !text-slate-400">
                  Nhân viên phụ trách
                </Typography.Text>
                <Typography.Text className="!font-semibold !text-ink">
                  {appointment.staffName}
                </Typography.Text>
              </div>
            </Space>

            <Space size={8} wrap>
              {appointment.promotionCode ? (
                <Tag color="purple">Mã {appointment.promotionCode}</Tag>
              ) : null}
            </Space>
          </div>

          {appointment.note ? (
            <div className="appointment-history-note">
              <FileTextOutlined />
              <span>{appointment.note}</span>
            </div>
          ) : null}
        </div>

        <aside className="appointment-history-side">
          <div className="appointment-history-price">
            <Typography.Text className="block !text-xs !font-semibold uppercase !text-slate-400">
              Tổng thanh toán
            </Typography.Text>
            <strong>{formatCurrency(appointment.invoiceAmount)}</strong>
          </div>

          <div className="appointment-history-actions">
            {canReview ? (
              <Button icon={<StarOutlined />} onClick={() => onReview(appointment)}>
                Đánh giá
              </Button>
            ) : null}
            {canPayInvoice ? (
              <Button
                type="primary"
                icon={<CreditCardOutlined />}
                onClick={() => onPayInvoice(appointment.invoiceId)}
              >
                Tiếp tục thanh toán
              </Button>
            ) : null}
          </div>
        </aside>
      </div>
    </Card>
  );
}

export function AppointmentHistoryPage() {
  const navigate = useNavigate();
  const [, toastContextHolder] = notification.useNotification();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_BOOKING_HISTORY_PAGE_SIZE);
  const [selectedReviewAppointment, setSelectedReviewAppointment] =
    useState<AppointmentHistoryModel | null>(null);
  const queryParams = useMemo(
    () => ({
      limit: pageSize,
      page,
    }),
    [page, pageSize],
  );
  const {
    data: bookingHistory,
    error,
    isError,
    isFetching,
    isLoading,
    refetch,
  } = useAppointmentHistoryQuery(queryParams);

  const appointments = bookingHistory?.items ?? [];
  const total = bookingHistory?.total ?? 0;

  const handlePayInvoice = (invoiceId: string) => {
    navigate(`/invoices/checkout?invoiceId=${encodeURIComponent(invoiceId)}`);
  };

  const handleReview = (appointment: AppointmentHistoryModel) => {
    setSelectedReviewAppointment(appointment);
  };

  return (
    <main className="booking-history-page bg-[#f7f4ee] px-4 py-8 md:px-8 md:py-12">
      {toastContextHolder}
      <section className="mx-auto max-w-7xl">
        <div className="booking-history-hero mb-6">
          <div>
            <Typography.Text className="!font-semibold uppercase tracking-[0.18em] !text-sage">
              Lịch sử đặt dịch vụ
            </Typography.Text>
            <Typography.Title level={2} className="!mb-2 !mt-2 !text-ink">
              Theo dõi toàn bộ lịch hẹn của bạn
            </Typography.Title>
            <Typography.Text className="max-w-2xl !text-slate-500">
              Kiểm tra thông tin dịch vụ, thời gian, nhân viên phụ trách, ghi chú và thanh toán
              của từng lịch hẹn tại HomeFeel.
            </Typography.Text>
          </div>
          <Button icon={<ReloadOutlined />} loading={isFetching} onClick={() => void refetch()}>
            Làm mới
          </Button>
        </div>

        {isLoading ? (
          <AppointmentHistorySkeleton />
        ) : isError ? (
          <Card>
            <Empty description={getApiErrorMessage(error, 'Vui lòng thử lại sau.')}>
              <Button icon={<ReloadOutlined />} onClick={() => void refetch()}>
                Tải lại lịch sử
              </Button>
            </Empty>
          </Card>
        ) : appointments.length > 0 ? (
          <div className="grid gap-4">
            {appointments.map((appointment) => (
              <AppointmentHistoryCard
                appointment={appointment}
                key={appointment.appointmentDetailId}
                onPayInvoice={handlePayInvoice}
                onReview={handleReview}
              />
            ))}
          </div>
        ) : (
          <Card>
            <Empty description="Bạn chưa có lịch hẹn nào">
              <Button type="primary" onClick={() => navigate('/services')}>
                Khám phá dịch vụ
              </Button>
            </Empty>
          </Card>
        )}

        {total > 0 ? (
          <div className="booking-history-pagination mt-6">
            <Typography.Text className="!text-sm !text-slate-500">
              Trang {page} trên {Math.max(1, Math.ceil(total / pageSize))}
            </Typography.Text>
            <AppPagination
              current={page}
              disabled={isFetching}
              onChange={(nextPage, nextPageSize) => {
                setPage(nextPage);
                setPageSize(nextPageSize);
              }}
              pageSize={pageSize}
              pageSizeOptions={[3, 6, 9]}
              showSizeChanger={false}
              showTotal={false}
              total={total}
            />
          </div>
        ) : null}
      </section>
      <AppointmentReviewModal
        appointment={selectedReviewAppointment}
        open={Boolean(selectedReviewAppointment)}
        onClose={() => setSelectedReviewAppointment(null)}
        onSuccess={() => void refetch()}
      />
    </main>
  );
}
