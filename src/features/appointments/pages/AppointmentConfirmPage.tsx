import {
  ArrowLeftOutlined,
  CheckCircleOutlined,
  FileTextOutlined,
  PictureOutlined,
  StarFilled,
  UserOutlined,
} from '@ant-design/icons';
import {
  Alert,
  Avatar,
  Button,
  Card,
  Col,
  Empty,
  Form,
  Image,
  Input,
  Row,
  Space,
  Tag,
  Typography,
  notification,
} from 'antd';
import { isAxiosError } from 'axios';
import { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

import { formatAppointmentDateTimeRange } from '@/shared/utils/date-format';
import { getApiErrorMessage } from '@/shared/utils/api-error';

import { appointmentBookingApi } from '../api/appointment-booking-api';
import type { AppointmentBookingConfirmState } from '../types/appointment-type';

interface AppointmentConfirmFormValues {
  note?: string;
}

const formatRemainingTime = (seconds: number) => {
  const safeSeconds = Math.max(0, seconds);
  const minutes = Math.floor(safeSeconds / 60)
    .toString()
    .padStart(2, '0');
  const remainingSeconds = (safeSeconds % 60).toString().padStart(2, '0');

  return `${minutes}:${remainingSeconds}`;
};

const getInitials = (name: string) =>
  name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

const isBadRequestError = (error: unknown) => isAxiosError(error) && error.response?.status === 400;

export function AppointmentConfirmPage() {
  const [form] = Form.useForm<AppointmentConfirmFormValues>();
  const [toast, toastContextHolder] = notification.useNotification();
  const [submitting, setSubmitting] = useState(false);
  const [remainingSeconds, setRemainingSeconds] = useState<number | null>(null);
  const [selectedImage, setSelectedImage] = useState<string>();
  const expiredHoldTokenRef = useRef<string | null>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const bookingState = location.state as AppointmentBookingConfirmState | null;
  const hold = bookingState?.hold;
  const service = bookingState?.service;
  const staff = bookingState?.staff;
  const isExpired = Boolean(hold && remainingSeconds !== null && remainingSeconds <= 0);
  const displayRemainingSeconds = remainingSeconds ?? hold?.expiresInSeconds ?? 0;
  const previewImage = service?.imageUrl ?? service?.imageUrls[0];
  const galleryImages = service?.imageUrls.length ? service.imageUrls : previewImage ? [previewImage] : [];

  useEffect(() => {
    if (!hold) {
      setRemainingSeconds(null);
      return;
    }

    setRemainingSeconds(hold.expiresInSeconds);
    expiredHoldTokenRef.current = null;
  }, [hold]);

  useEffect(() => {
    setSelectedImage(previewImage);
  }, [previewImage]);

  useEffect(() => {
    if (!hold) {
      return undefined;
    }

    const timerId = window.setInterval(() => {
      setRemainingSeconds((currentSeconds) =>
        currentSeconds === null ? currentSeconds : Math.max(0, currentSeconds - 1),
      );
    }, 1000);

    return () => window.clearInterval(timerId);
  }, [hold]);

  useEffect(() => {
    if (!hold || remainingSeconds === null || remainingSeconds > 0) {
      return;
    }

    if (expiredHoldTokenRef.current === hold.holdToken) {
      return;
    }

    expiredHoldTokenRef.current = hold.holdToken;
    toast.warning({
      message: 'Thời gian giữ lịch đã hết',
      description: 'Vui lòng quay lại dịch vụ để chọn khung giờ hoặc nhân viên khác.',
      placement: 'topRight',
    });
  }, [hold, remainingSeconds, toast]);

  const handleConfirmBooking = async (values: AppointmentConfirmFormValues) => {
    if (!hold || !service || isExpired) {
      return;
    }

    setSubmitting(true);

    try {
      const response = await appointmentBookingApi.confirmBooking({
        holdToken: hold.holdToken,
        note: values.note?.trim() || undefined,
      });

      if (!response.success) {
        throw new Error(response.message || 'Không thể xác nhận lịch hẹn.');
      }

      toast.success({
        message: 'Đặt lịch thành công',
        description: 'Lịch hẹn của bạn đã được tạo và đang chờ trung tâm xác nhận.',
        placement: 'topRight',
      });
      navigate(`/invoices/checkout?invoiceId=${encodeURIComponent(response.data.invoiceId)}`, {
        replace: true,
        state: {
          invoiceId: response.data.invoiceId,
        },
      });
    } catch (error) {
      if (isBadRequestError(error)) {
        navigate(`/services/${service.id}`, {
          replace: true,
          state: {
            bookingError: getApiErrorMessage(
              error,
              'Khung giờ hoặc nhân viên không còn khả dụng. Vui lòng chọn lại.',
            ),
            service,
          },
        });
        return;
      }

      toast.error({
        message: 'Không thể xác nhận lịch hẹn',
        description: getApiErrorMessage(error, 'Vui lòng thử lại hoặc chọn lại khung giờ.'),
        placement: 'topRight',
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (!hold || !service || !staff) {
    return (
      <main className="min-h-[70vh] bg-[#f7f4ee] px-4 py-14 md:px-8">
        {toastContextHolder}
        <Card className="mx-auto max-w-3xl">
          <Empty description="Không tìm thấy thông tin lịch hẹn cần xác nhận">
            <Button type="primary" onClick={() => navigate('/services')}>
              Chọn dịch vụ
            </Button>
          </Empty>
        </Card>
      </main>
    );
  }

  return (
    <main className="appointment-confirm-page bg-[#f7f4ee]">
      {toastContextHolder}

      <section className="mx-auto max-w-7xl px-4 py-8 md:px-8 md:py-10">
        <div className="appointment-confirm-nav">
          <Space className="appointment-confirm-breadcrumb" size={8}>
            <Link to="/">Trang chủ</Link>
            <span className="text-slate-400">/</span>
            <Link to="/services">Dịch vụ</Link>
            <span className="text-slate-400">/</span>
            <Typography.Text className="!text-slate-600">Xác nhận lịch hẹn</Typography.Text>
          </Space>

          <Button
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate(`/services/${service.id}`, { state: { service } })}
          >
            Quay lại chi tiết dịch vụ
          </Button>
        </div>

        <div className="mb-8 max-w-3xl">
          <Typography.Text className="!font-semibold uppercase tracking-[0.14em] !text-sage">
            Xác nhận đặt dịch vụ
          </Typography.Text>
          <Typography.Title level={2} className="!mb-3 !mt-2 !text-ink">
            Kiểm tra lại thông tin lịch hẹn
          </Typography.Title>
          <Typography.Paragraph className="!text-base !leading-7 !text-slate-600">
            HomeFeel đang giữ khung giờ này tạm thời cho bạn. Hãy kiểm tra thông tin, thêm ghi chú
            nếu cần rồi xác nhận để tạo lịch hẹn chính thức.
          </Typography.Paragraph>
        </div>

        <Row gutter={[24, 24]} align="top">
          <Col xs={24} lg={15} xl={16}>
            <Space direction="vertical" size={20} className="w-full">
              <Card className="appointment-confirm-service-card">
                <div className="appointment-confirm-gallery">
                  <div className="appointment-confirm-image-wrap">
                    {selectedImage ? (
                      <Image
                        src={selectedImage}
                        alt={service.name}
                        preview={false}
                        className="appointment-confirm-image"
                      />
                    ) : (
                      <div className="appointment-confirm-image-placeholder">
                        <PictureOutlined />
                      </div>
                    )}
                  </div>

                  {galleryImages.length > 1 ? (
                    <div className="appointment-confirm-thumbnails">
                      {galleryImages.map((imageUrl) => (
                        <button
                          className={imageUrl === selectedImage ? 'active' : ''}
                          key={imageUrl}
                          onClick={() => setSelectedImage(imageUrl)}
                          type="button"
                        >
                          <img src={imageUrl} alt={service.name} />
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="appointment-confirm-image-note">
                      <PictureOutlined />
                      <span>Ảnh đại diện dịch vụ</span>
                    </div>
                  )}
                </div>
              </Card>

              <Card className="appointment-confirm-service-card">
                <div className="appointment-confirm-section-title">
                  <div>
                    <Typography.Text className="!font-semibold uppercase tracking-[0.12em] !text-sage">
                      Thông tin từ dịch vụ
                    </Typography.Text>
                    <Typography.Title level={4} className="!mb-0 !mt-1">
                      Nội dung đã chọn ở trang chi tiết
                    </Typography.Title>
                  </div>
                    <FileTextOutlined />
                  </div>

                <div className="appointment-confirm-service-heading-row">
                  <div className="min-w-0">
                    <div className="mb-2 flex flex-wrap items-center gap-2">
                      <Tag color={service.accentColor} className="!m-0 !font-semibold">
                        {service.category}
                      </Tag>
                      <Tag className="!m-0">Đang giữ lịch</Tag>
                    </div>
                    <Typography.Title level={3} className="!mb-1 !text-ink">
                      {service.name}
                    </Typography.Title>
                  </div>
                  <div className="appointment-confirm-service-price">
                    <span>Giá dịch vụ</span>
                    <strong>{service.price.toLocaleString('vi-VN')}đ</strong>
                  </div>
                </div>

                <div className="appointment-confirm-fact-grid">
                  <div>
                    <span>Danh mục</span>
                    <strong>{service.category}</strong>
                  </div>
                  <div>
                    <span>Giá dịch vụ</span>
                    <strong>{service.price.toLocaleString('vi-VN')}đ</strong>
                  </div>
                  <div>
                    <span>Đánh giá</span>
                    <strong>{service.rating ? service.rating.toFixed(1) : 'Chưa có'}</strong>
                  </div>
                  <div>
                    <span>Thời lượng</span>
                    <strong>{service.durationMinutes} phút</strong>
                  </div>
                  <div>
                    <span>Địa điểm</span>
                    <strong>{service.location}</strong>
                  </div>
                </div>

                <div className="appointment-confirm-service-description">
                  <Typography.Text strong>Mô tả dịch vụ</Typography.Text>
                  <Typography.Paragraph className="!mb-0 !mt-2 !text-slate-600">
                    {service.description}
                  </Typography.Paragraph>
                </div>
              </Card>

              <Card className="appointment-confirm-staff-card">
                <div className="mb-4 flex items-center justify-between gap-4">
                  <div>
                    <Typography.Text className="!font-semibold uppercase tracking-[0.12em] !text-sage">
                      Nhân viên phụ trách
                    </Typography.Text>
                    <Typography.Title level={4} className="!mb-0 !mt-1">
                      Người thực hiện dịch vụ
                    </Typography.Title>
                  </div>
                  <CheckCircleOutlined className="text-2xl text-sage" />
                </div>

                <div className="appointment-confirm-staff-profile">
                  <Avatar size={64} src={staff.avatarUrl} icon={<UserOutlined />}>
                    {getInitials(staff.name)}
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <Typography.Title level={4} className="!mb-1">
                      {staff.name}
                    </Typography.Title>
                    <Space size={12} className="appointment-confirm-staff-meta">
                      <span>
                        <StarFilled /> {staff.rating}
                      </span>
                      <span>{staff.completedServices}+ lịch hẹn</span>
                    </Space>
                    {staff.specialties.length ? (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {staff.specialties.slice(0, 4).map((specialty) => (
                          <Tag key={specialty} className="!m-0">
                            {specialty}
                          </Tag>
                        ))}
                      </div>
                    ) : null}
                  </div>
                </div>
              </Card>

              <Card className="appointment-confirm-service-card">
                <div className="appointment-confirm-section-title">
                  <div>
                    <Typography.Text className="!font-semibold uppercase tracking-[0.12em] !text-sage">
                      Quy trình xác nhận
                    </Typography.Text>
                    <Typography.Title level={4} className="!mb-0 !mt-1">
                      Trạng thái sau khi đặt
                    </Typography.Title>
                  </div>
                  <CheckCircleOutlined />
                </div>

                <div className="appointment-confirm-timeline">
                  <div className="active">
                    <span>1</span>
                    <div>
                      <strong>Giữ khung giờ</strong>
                      <small>Slot đang được giữ tạm bằng hold token.</small>
                    </div>
                  </div>
                  <div className="active">
                    <span>2</span>
                    <div>
                      <strong>Xác nhận thông tin</strong>
                      <small>Bạn kiểm tra lại dịch vụ, nhân viên và ghi chú.</small>
                    </div>
                  </div>
                  <div>
                    <span>3</span>
                    <div>
                      <strong>Chờ trung tâm duyệt</strong>
                      <small>Lịch hẹn sẽ ở trạng thái chờ xác nhận sau khi tạo.</small>
                    </div>
                  </div>
                </div>
              </Card>
            </Space>
          </Col>

          <Col xs={24} lg={9} xl={8}>
            <Card className="appointment-confirm-summary-card">
              <Alert
                showIcon
                className="mb-5"
                type={isExpired ? 'warning' : 'info'}
                message={
                  isExpired
                    ? 'Thời gian giữ lịch đã hết'
                    : `Đang giữ lịch trong ${formatRemainingTime(displayRemainingSeconds)}`
                }
                description={
                  isExpired
                    ? 'Slot này không còn được giữ. Bạn cần quay lại dịch vụ để chọn lại thời gian.'
                    : 'Lịch chỉ được tạo sau khi bạn bấm xác nhận đặt dịch vụ.'
                }
              />

              <div className="appointment-confirm-price-box">
                <Typography.Text className="block !text-sm !font-semibold uppercase tracking-[0.12em] !text-slate-500">
                  Tổng tạm tính
                </Typography.Text>
                <Typography.Title level={2} className="!mb-0 !mt-1 !text-sage">
                  {service.price.toLocaleString('vi-VN')}đ
                </Typography.Title>
              </div>

              <div className="appointment-confirm-detail-list">
                <div>
                  <span>Dịch vụ</span>
                  <strong>{service.name}</strong>
                </div>
                <div>
                  <span>Thời gian</span>
                  <strong>{formatAppointmentDateTimeRange(hold.startTime, hold.endTime)}</strong>
                </div>
                <div>
                  <span>Danh mục</span>
                  <strong>{service.category}</strong>
                </div>
                <div>
                  <span>Thời lượng</span>
                  <strong>{service.durationMinutes} phút</strong>
                </div>
                <div>
                  <span>Địa điểm</span>
                  <strong>{service.location}</strong>
                </div>
                <div>
                  <span>Nhân viên</span>
                  <strong>{staff.name}</strong>
                </div>
              </div>

              <Form<AppointmentConfirmFormValues>
                form={form}
                layout="vertical"
                className="mt-5"
                onFinish={(values) => void handleConfirmBooking(values)}
              >
                <Form.Item
                  name="note"
                  label="Ghi chú cho trung tâm"
                  rules={[{ max: 1000, message: 'Ghi chú tối đa 1000 ký tự.' }]}
                >
                  <Input.TextArea
                    showCount
                    maxLength={1000}
                    rows={5}
                    placeholder="Ví dụ: muốn phòng yên tĩnh, có lưu ý sức khỏe, cần hỗ trợ thêm..."
                  />
                </Form.Item>

                <Button
                  block
                  disabled={isExpired}
                  htmlType="submit"
                  loading={submitting}
                  size="large"
                  type="primary"
                >
                  Xác nhận đặt dịch vụ
                </Button>
              </Form>

              <Button
                block
                className="mt-3"
                onClick={() => navigate(`/services/${service.id}`, { state: { service } })}
              >
                Chọn lại thời gian
              </Button>
            </Card>
          </Col>
        </Row>
      </section>
    </main>
  );
}
