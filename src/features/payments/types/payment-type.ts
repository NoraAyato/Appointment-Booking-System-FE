export type PaymentStatus = 'PENDING' | 'PAID' | 'FAILED';

export interface MomoPaymentResponse {
  paymentId: string;
  invoiceId: string;
  orderId: string;
  requestId: string;
  payUrl: string;
  deeplink?: string | null;
  qrCodeUrl?: string | null;
}

export interface PaymentDetail {
  paymentId: string;
  invoiceId: string;
  amount: number;
  paymentMethod: string;
  status: PaymentStatus;
  orderId: string;
  requestId: string;
  paymentDate: string | null;
}

export interface PendingMomoPaymentContext {
  paymentId: string;
  invoiceId: string;
  orderId: string;
  requestId: string;
}
