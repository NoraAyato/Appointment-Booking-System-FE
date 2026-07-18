import type { PaymentStatus } from '../types/payment-type';

export const MOMO_PAYMENT_SESSION_KEY = 'homefeel.pendingMomoPayment';

export const PAYMENT_STATUS_POLLING_INTERVAL_MS = 3000;

export const paymentStatusLabels: Record<PaymentStatus, string> = {
  FAILED: 'Thanh toán chưa hoàn tất',
  PAID: 'Thanh toán thành công',
  PENDING: 'Đang xác nhận thanh toán',
};

export const paymentStatusDescriptions: Record<PaymentStatus, string> = {
  FAILED: 'Giao dịch chưa hoàn tất. Bạn có thể quay lại hóa đơn để thử thanh toán lại.',
  PAID: 'Thanh toán MoMo đã hoàn tất. Cảm ơn bạn đã đặt dịch vụ tại HomeFeel.',
  PENDING: 'Giao dịch đang được xác nhận. Trạng thái sẽ tự cập nhật trong giây lát.',
};
