import {
  ArrowLeftOutlined,
  BankOutlined,
  CalendarOutlined,
  CheckCircleOutlined,
  CreditCardOutlined,
  GiftOutlined,
  UserOutlined,
} from '@ant-design/icons';
import {
  Avatar,
  Button,
  Card,
  Col,
  Empty,
  Image,
  Input,
  Row,
  Space,
  Tag,
  Typography,
  notification,
} from 'antd';
import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom';

import momoLogo from '@/assets/payment/momo-logo.svg';
import { getApiErrorMessage } from '@/shared/utils/api-error';
import { getAssetUrl } from '@/shared/utils/asset-url';
import { formatDate, formatDateTime, formatTimeRange } from '@/shared/utils/date-format';

import { invoiceApi } from '../api/invoice-api';
import {
  appointmentStatusLabels,
  invoicePaymentMethodOptions,
  invoiceStatusLabels,
} from '../constants/invoice-options';
import type {
  InvoiceCheckoutRouteState,
  InvoiceDetail,
  InvoicePaymentMethod,
} from '../types/invoice-type';

type CurrencyValue = string | number | null | undefined;

const parseCurrencyNumber = (value?: CurrencyValue) => {
  if (value === null || value === undefined || value === '') {
    return null;
  }

  const normalizedValue =
    typeof value === 'number' ? String(value) : String(value).replace(/[^\d.-]/g, '');
  const numericValue = Number(normalizedValue);

  return Number.isFinite(numericValue) ? numericValue : null;
};

const formatCurrency = (value?: CurrencyValue) => {
  const numericValue = parseCurrencyNumber(value);

  if (numericValue === null) {
    return value ? String(value) : 'Chưa cập nhật';
  }

  return `${Math.max(0, numericValue).toLocaleString('vi-VN')}đ`;
};

const getPayableAmount = (totalPrice?: CurrencyValue, discountValue?: CurrencyValue) => {
  const totalNumber = parseCurrencyNumber(totalPrice);

  if (totalNumber === null) {
    return formatCurrency(totalPrice);
  }

  const discountNumber = parseCurrencyNumber(discountValue) ?? 0;

  return formatCurrency(totalNumber - discountNumber);
};

const getDiscountLabel = (discountValue?: CurrencyValue) => {
  const discountNumber = parseCurrencyNumber(discountValue);

  if (discountNumber === null || discountNumber <= 0) {
    return 'Chưa có';
  }

  return `-${formatCurrency(discountNumber)}`;
};

const getInitials = (name: string) =>
  name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

const getPaymentIcon = (method: InvoicePaymentMethod) =>
  method === 'MOMO' ? (
    <img src={momoLogo} alt="MoMo" className="invoice-momo-logo" />
  ) : (
    <BankOutlined />
  );

const getStatusLabel = (status: string, labels: Record<string, string>) => labels[status] ?? status;

const getInvoiceCode = (invoiceId: string) => `INV-${invoiceId}`;

export function InvoiceCheckoutPage() {
  const [toast, toastContextHolder] = notification.useNotification();
  const [invoice, setInvoice] = useState<InvoiceDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<InvoicePaymentMethod>('MOMO');
  const [promotionCodeInput, setPromotionCodeInput] = useState('');
  const [promotionApplying, setPromotionApplying] = useState(false);
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();
  const routeState = location.state as InvoiceCheckoutRouteState | null;
  const invoiceId = searchParams.get('invoiceId') ?? routeState?.invoiceId ?? '';
  const hasAppliedPromotion = Boolean(
    invoice?.promotionCode?.trim() && invoice.discountValue !== null && invoice.discountValue !== undefined,
  );

  useEffect(() => {
    if (!invoiceId) {
      setInvoice(null);
      setPromotionCodeInput('');
      setErrorMessage('Không tìm thấy mã hóa đơn cần thanh toán.');
      return;
    }

    const fetchInvoice = async () => {
      setLoading(true);
      setErrorMessage(null);

      try {
        const response = await invoiceApi.getDetail(invoiceId);

        if (!response.success) {
          throw new Error(response.message || 'Không thể tải hóa đơn.');
        }

        setInvoice(response.data);
        setPromotionCodeInput(response.data.promotionCode ?? '');
      } catch (error) {
        setInvoice(null);
        setPromotionCodeInput('');
        setErrorMessage(getApiErrorMessage(error, 'Vui lòng thử lại sau.'));
      } finally {
        setLoading(false);
      }
    };

    void fetchInvoice();
  }, [invoiceId]);

  const handleApplyPromotion = async () => {
    const promotionCode = promotionCodeInput.trim().toUpperCase();

    if (!invoiceId || !invoice || hasAppliedPromotion) {
      return;
    }

    if (!promotionCode) {
      toast.warning({
        message: 'Vui lòng nhập mã khuyến mãi',
        placement: 'topRight',
      });
      return;
    }

    setPromotionApplying(true);

    try {
      const response = await invoiceApi.applyPromotion(invoiceId, {
        promotionCode,
      });

      if (!response.success) {
        throw new Error(response.message || 'Không thể áp dụng khuyến mãi.');
      }

      setInvoice({
        ...invoice,
        discountValue: response.data.discountValue,
        promotionCode: response.data.promotionCode,
      });
      setPromotionCodeInput(response.data.promotionCode);

      toast.success({
        message: 'Áp dụng khuyến mãi thành công',
        description: response.message || 'Mã khuyến mãi đã được áp dụng cho hóa đơn.',
        placement: 'topRight',
      });
    } catch (error) {
      toast.error({
        message: 'Không thể áp dụng khuyến mãi',
        description: getApiErrorMessage(error, 'Vui lòng kiểm tra mã và thử lại.'),
        placement: 'topRight',
      });
    } finally {
      setPromotionApplying(false);
    }
  };

  const handleContinue = () => {
    toast.success({
      message: paymentMethod === 'MOMO' ? 'Sẵn sàng chuyển sang MoMo' : 'Đã ghi nhận thanh toán tại chỗ',
      description:
        paymentMethod === 'MOMO'
          ? 'Cổng thanh toán thật sẽ được nối ở bước tiếp theo.'
          : 'Hóa đơn sẽ được thanh toán tại trung tâm khi bạn đến sử dụng dịch vụ.',
      placement: 'topRight',
    });
    navigate('/booking-history');
  };

  if (!invoice) {
    return (
      <main className="invoice-checkout-page min-h-[70vh] bg-[#f7f4ee] px-4 py-14 md:px-8">
        {toastContextHolder}
        <Card className="mx-auto max-w-3xl">
          <Empty
            description={
              loading
                ? 'Đang tải thông tin hóa đơn...'
                : errorMessage || 'Không tìm thấy thông tin hóa đơn cần thanh toán'
            }
          >
            <Space>
              <Button onClick={() => navigate('/services')}>Chọn dịch vụ</Button>
              {invoiceId ? (
                <Button type="primary" loading={loading} onClick={() => navigate(0)}>
                  Tải lại
                </Button>
              ) : null}
            </Space>
          </Empty>
        </Card>
      </main>
    );
  }

  const previewImage = getAssetUrl(invoice.serviceImage);
  const staffAvatarUrl = getAssetUrl(invoice.staffImage);
  const invoiceCode = getInvoiceCode(invoice.invoiceId);
  const invoiceStatusLabel = getStatusLabel(invoice.invoiceStatus, invoiceStatusLabels);
  const appointmentStatusLabel = getStatusLabel(
    invoice.appointmentStatus,
    appointmentStatusLabels,
  );
  const totalPrice = formatCurrency(invoice.totalPrice);
  const discountLabel = hasAppliedPromotion ? getDiscountLabel(invoice.discountValue) : 'Chưa có';
  const payableAmount = getPayableAmount(invoice.totalPrice, invoice.discountValue);
  const appliedPromotionCode = invoice.promotionCode?.trim();

  return (
    <main className="invoice-checkout-page bg-[#f7f4ee]">
      {toastContextHolder}

      <section className="mx-auto max-w-7xl px-4 py-8 md:px-8 md:py-10">
        <div className="invoice-checkout-nav">
          <Space className="invoice-checkout-breadcrumb" size={8}>
            <Link to="/">Trang chủ</Link>
            <span className="text-slate-400">/</span>
            <Link to="/services">Dịch vụ</Link>
            <span className="text-slate-400">/</span>
            <Typography.Text className="!text-slate-600">Hóa đơn</Typography.Text>
          </Space>

          <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/services')}>
            Quay lại dịch vụ
          </Button>
        </div>

        <div className="mb-8 max-w-3xl">
          <Typography.Text className="!font-semibold uppercase tracking-[0.14em] !text-sage">
            Hóa đơn dịch vụ
          </Typography.Text>
          <Typography.Title level={2} className="!mb-3 !mt-2 !text-ink">
            Thanh toán và hoàn tất lịch hẹn
          </Typography.Title>
          <Typography.Paragraph className="!text-base !leading-7 !text-slate-600">
            Kiểm tra lại hóa đơn, chọn phương thức thanh toán phù hợp và tiếp tục xử lý thanh toán.
          </Typography.Paragraph>
        </div>

        <Row gutter={[24, 24]} align="top">
          <Col xs={24} lg={15} xl={16}>
            <Space direction="vertical" size={20} className="w-full">
              <Card className="invoice-checkout-card invoice-checkout-overview-card">
                <div>
                  <Typography.Text className="!font-semibold uppercase tracking-[0.12em] !text-sage">
                    Mã hóa đơn
                  </Typography.Text>
                  <Typography.Title level={3} className="!mb-0 !mt-1 !text-ink">
                    {invoiceCode}
                  </Typography.Title>
                  <Typography.Text className="!text-slate-500">
                    Tạo lúc {formatDateTime(invoice.createdAt)}
                  </Typography.Text>
                </div>
                <div className="invoice-checkout-overview-total">
                  <Tag color="gold" className="!m-0 !font-semibold">
                    {invoiceStatusLabel}
                  </Tag>
                  <span>Tổng cần thanh toán</span>
                  <strong>{payableAmount}</strong>
                </div>
              </Card>

              <Card className="invoice-checkout-card">
                <div className="invoice-service-layout">
                  <div className="invoice-service-image-wrap">
                    {previewImage ? (
                      <Image
                        src={previewImage}
                        alt={invoice.serviceName}
                        preview={false}
                        className="invoice-service-image"
                      />
                    ) : (
                      <div className="invoice-service-image-placeholder">
                        <CalendarOutlined />
                      </div>
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="mb-3 flex flex-wrap items-center gap-2">
                      <Tag color={invoice.categoryColorTag} className="!m-0 !font-semibold">
                        {invoice.categoryName}
                      </Tag>
                      <Tag className="!m-0">{appointmentStatusLabel}</Tag>
                    </div>

                    <Typography.Title level={3} className="!mb-2 !text-ink">
                      {invoice.serviceName}
                    </Typography.Title>
                    <Typography.Paragraph className="!text-slate-600">
                      {invoice.serviceDescription}
                    </Typography.Paragraph>

                    <div className="invoice-service-fact-grid">
                      <div>
                        <span>Ngày hẹn</span>
                        <strong>{formatDate(invoice.bookingDate)}</strong>
                      </div>
                      <div>
                        <span>Khung giờ</span>
                        <strong>{formatTimeRange(invoice.startTime, invoice.endTime)}</strong>
                      </div>
                      <div>
                        <span>Thời lượng</span>
                        <strong>{invoice.duration} phút</strong>
                      </div>
                      <div>
                        <span>Trạng thái lịch</span>
                        <strong>{appointmentStatusLabel}</strong>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>

              <Card className="invoice-checkout-card">
                <div className="invoice-section-title">
                  <div>
                    <Typography.Text className="!font-semibold uppercase tracking-[0.12em] !text-sage">
                      Thông tin lịch hẹn
                    </Typography.Text>
                    <Typography.Title level={4} className="!mb-0 !mt-1">
                      Người phụ trách và ghi chú
                    </Typography.Title>
                  </div>
                  <CheckCircleOutlined />
                </div>

                <div className="invoice-staff-note-grid">
                  <div className="invoice-staff-box">
                    <Avatar size={60} src={staffAvatarUrl} icon={<UserOutlined />}>
                      {getInitials(invoice.staffName)}
                    </Avatar>
                    <div className="min-w-0">
                      <Typography.Title level={4} className="!mb-1">
                        {invoice.staffName}
                      </Typography.Title>
                      <Typography.Text className="!text-slate-500">
                        {invoice.staffSpecializations?.slice(0, 3).join(', ') ||
                          'Nhân viên HomeFeel'}
                      </Typography.Text>
                    </div>
                  </div>

                  <div className="invoice-note-box">
                    <Typography.Text strong>Ghi chú cho trung tâm</Typography.Text>
                    <Typography.Paragraph className="!mb-0 !mt-2 !text-slate-600">
                      {invoice.note || 'Không có ghi chú.'}
                    </Typography.Paragraph>
                  </div>
                </div>
              </Card>

              <Card className="invoice-checkout-card">
                <div className="invoice-section-title">
                  <div>
                    <Typography.Text className="!font-semibold uppercase tracking-[0.12em] !text-sage">
                      Phương thức thanh toán
                    </Typography.Text>
                    <Typography.Title level={4} className="!mb-0 !mt-1">
                      Chọn cách thanh toán
                    </Typography.Title>
                  </div>
                  <CreditCardOutlined />
                </div>

                <div className="invoice-payment-method-grid">
                  {invoicePaymentMethodOptions.map((method) => {
                    const isSelected = paymentMethod === method.value;
                    const methodClassName = [
                      'invoice-payment-method',
                      method.value === 'MOMO' ? 'momo-method' : 'cash-method',
                      isSelected ? 'selected' : '',
                    ]
                      .filter(Boolean)
                      .join(' ');

                    return (
                      <button
                        className={methodClassName}
                        key={method.value}
                        onClick={() => setPaymentMethod(method.value)}
                        type="button"
                      >
                        <span className="invoice-payment-logo-frame">
                          {getPaymentIcon(method.value)}
                        </span>
                        <div>
                          <strong>{method.label}</strong>
                          <small>{method.description}</small>
                        </div>
                        {isSelected ? <CheckCircleOutlined className="invoice-payment-check" /> : null}
                      </button>
                    );
                  })}
                </div>
              </Card>
            </Space>
          </Col>

          <Col xs={24} lg={9} xl={8}>
            <Card className="invoice-checkout-card invoice-summary-card">
              <div className="invoice-summary-heading">
                <div>
                  <Typography.Text className="!font-semibold uppercase tracking-[0.12em] !text-sage">
                    Thanh toán
                  </Typography.Text>
                  <Typography.Title level={4} className="!mb-0 !mt-1">
                    Tóm tắt hóa đơn
                  </Typography.Title>
                </div>
                <CreditCardOutlined />
              </div>

              <div className="invoice-promotion-box">
                <Typography.Text className="mb-2 block !font-semibold">
                  Mã khuyến mãi
                </Typography.Text>
                <Space.Compact className="w-full">
                  <Input
                    disabled={hasAppliedPromotion}
                    placeholder="Nhập mã khuyến mãi"
                    value={promotionCodeInput}
                    onChange={(event) => setPromotionCodeInput(event.target.value.toUpperCase())}
                    onPressEnter={() => void handleApplyPromotion()}
                  />
                  <Button
                    disabled={!promotionCodeInput.trim() || hasAppliedPromotion}
                    icon={<GiftOutlined />}
                    loading={promotionApplying}
                    onClick={() => void handleApplyPromotion()}
                  >
                    Áp dụng
                  </Button>
                </Space.Compact>

                {hasAppliedPromotion ? (
                  <div className="invoice-promotion-applied">
                    <CheckCircleOutlined />
                    <span>
                      Mã {appliedPromotionCode} đã được áp dụng, giảm {formatCurrency(invoice.discountValue)}.
                    </span>
                  </div>
                ) : null}
              </div>

              <div className="invoice-summary-list">
                <div>
                  <span>Tiền dịch vụ</span>
                  <strong>{totalPrice}</strong>
                </div>
                <div>
                  <span>Khuyến mãi</span>
                  <strong>{discountLabel}</strong>
                </div>
                <div>
                  <span>Trạng thái hóa đơn</span>
                  <strong>{invoiceStatusLabel}</strong>
                </div>
                <div>
                  <span>Phương thức</span>
                  <strong>
                    {
                      invoicePaymentMethodOptions.find((method) => method.value === paymentMethod)
                        ?.label
                    }
                  </strong>
                </div>
              </div>

              <div className="invoice-total-box">
                <span>Cần thanh toán</span>
                <strong>{payableAmount}</strong>
              </div>

              <Button block size="large" type="primary" onClick={handleContinue}>
                Tiếp tục
              </Button>
            </Card>
          </Col>
        </Row>
      </section>
    </main>
  );
}
