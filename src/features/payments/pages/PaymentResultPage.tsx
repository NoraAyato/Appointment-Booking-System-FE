import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
} from '@ant-design/icons';
import { Alert, Button, Card, Empty, Result, Space, Spin, Typography } from 'antd';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';

import { getApiErrorMessage } from '@/shared/utils/api-error';

import { paymentApi } from '../api/payment-api';
import {
  PAYMENT_STATUS_POLLING_INTERVAL_MS,
  paymentStatusDescriptions,
  paymentStatusLabels,
} from '../constants/payment-options';
import type { PaymentDetail, PaymentStatus, PendingMomoPaymentContext } from '../types/payment-type';
import { clearPendingMomoPayment, getPendingMomoPayment } from '../utils/payment-session';

const getResultIcon = (status?: PaymentStatus) => {
  if (status === 'PAID') {
    return <CheckCircleOutlined className="payment-result-status-icon paid" />;
  }

  if (status === 'FAILED') {
    return <CloseCircleOutlined className="payment-result-status-icon failed" />;
  }

  return <ClockCircleOutlined className="payment-result-status-icon pending" />;
};

const getResultStatus = (status?: PaymentStatus) => {
  if (status === 'PAID') {
    return 'success';
  }

  if (status === 'FAILED') {
    return 'error';
  }

  return 'info';
};

const getPaymentContextFromQuery = (
  searchParams: URLSearchParams,
  storedContext: PendingMomoPaymentContext | null,
) => {
  const queryPaymentId = searchParams.get('paymentId') ?? searchParams.get('orderId');
  const queryInvoiceId = searchParams.get('invoiceId');

  return {
    invoiceId: queryInvoiceId ?? storedContext?.invoiceId ?? '',
    paymentId: queryPaymentId ?? storedContext?.paymentId ?? '',
  };
};

export function PaymentResultPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const storedContext = useMemo(() => getPendingMomoPayment(), []);
  const paymentContext = useMemo(
    () => getPaymentContextFromQuery(searchParams, storedContext),
    [searchParams, storedContext],
  );
  const [payment, setPayment] = useState<PaymentDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fetchPaymentStatus = useCallback(
    async (silent = false) => {
      if (!paymentContext.paymentId && !paymentContext.invoiceId) {
        setPayment(null);
        setLoading(false);
        setErrorMessage('Không tìm thấy thông tin giao dịch cần kiểm tra.');
        return;
      }

      if (!silent) {
        setLoading(true);
      }

      setErrorMessage(null);

      try {
        const response = paymentContext.paymentId
          ? await paymentApi.getPayment(paymentContext.paymentId)
          : await paymentApi.getLatestInvoicePayment(paymentContext.invoiceId);

        if (!response.success) {
          throw new Error(response.message || 'Không thể kiểm tra trạng thái thanh toán.');
        }

        setPayment(response.data);

        if (response.data.status !== 'PENDING') {
          clearPendingMomoPayment();
        }
      } catch (error) {
        setPayment(null);
        setErrorMessage(getApiErrorMessage(error, 'Vui lòng thử lại sau.'));
      } finally {
        setLoading(false);
      }
    },
    [paymentContext.invoiceId, paymentContext.paymentId],
  );

  useEffect(() => {
    void fetchPaymentStatus();
  }, [fetchPaymentStatus]);

  useEffect(() => {
    if (payment?.status !== 'PENDING') {
      return undefined;
    }

    const timerId = window.setTimeout(() => {
      void fetchPaymentStatus(true);
    }, PAYMENT_STATUS_POLLING_INTERVAL_MS);

    return () => window.clearTimeout(timerId);
  }, [fetchPaymentStatus, payment?.status]);

  if (loading && !payment) {
    return (
      <main className="payment-result-page bg-[#f7f4ee] px-4 py-14 md:px-8">
        <Card className="payment-result-card mx-auto max-w-3xl">
          <div className="grid min-h-[260px] place-items-center">
            <Spin size="large" />
          </div>
        </Card>
      </main>
    );
  }

  if (!payment) {
    return (
      <main className="payment-result-page bg-[#f7f4ee] px-4 py-14 md:px-8">
        <Card className="payment-result-card mx-auto max-w-3xl">
          <Empty description={errorMessage || 'Không tìm thấy giao dịch cần kiểm tra'}>
            <Space wrap>
              <Button type="primary" onClick={() => navigate('/services')}>
                Chọn dịch vụ
              </Button>
            </Space>
          </Empty>
        </Card>
      </main>
    );
  }

  const isPending = payment.status === 'PENDING';
  const isFailed = payment.status === 'FAILED';
  const invoiceCheckoutUrl = `/invoices/checkout?invoiceId=${encodeURIComponent(payment.invoiceId)}`;

  return (
    <main className="payment-result-page bg-[#f7f4ee] px-4 py-10 md:px-8">
      <section className="mx-auto max-w-5xl">
        <div className="mb-6 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <Typography.Text className="!font-semibold uppercase tracking-[0.14em] !text-sage">
              Kết quả thanh toán
            </Typography.Text>
            <Typography.Title level={2} className="!mb-0 !mt-2 !text-ink">
              Trạng thái giao dịch MoMo
            </Typography.Title>
          </div>
          <Link to={invoiceCheckoutUrl}>Quay lại hóa đơn</Link>
        </div>

        <Card className="payment-result-card">
          <Result
            icon={getResultIcon(payment.status)}
            status={getResultStatus(payment.status)}
            title={paymentStatusLabels[payment.status]}
            subTitle={paymentStatusDescriptions[payment.status]}
            extra={
              <Space wrap>
                {isFailed ? (
                  <Button type="primary" onClick={() => navigate(invoiceCheckoutUrl)}>
                    Thanh toán lại
                  </Button>
                ) : null}
                {payment.status === 'PAID' ? (
                  <Button type="primary" onClick={() => navigate('/booking-history')}>
                    Xem lịch sử đặt dịch vụ
                  </Button>
                ) : null}
              </Space>
            }
          />

          {isPending ? (
            <Alert
              showIcon
              className="mb-6"
              type="info"
              message="Giao dịch đang được xác nhận"
              description="Bạn có thể kiểm tra lại sau ít phút. Nếu tiền đã bị trừ nhưng trạng thái chưa cập nhật, HomeFeel sẽ tiếp tục đối soát giao dịch."
            />
          ) : null}
        </Card>
      </section>
    </main>
  );
}
