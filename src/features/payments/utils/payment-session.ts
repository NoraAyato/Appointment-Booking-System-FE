import { MOMO_PAYMENT_SESSION_KEY } from '../constants/payment-options';
import type { MomoPaymentResponse, PendingMomoPaymentContext } from '../types/payment-type';

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null;

const toPendingMomoPaymentContext = (
  value: MomoPaymentResponse,
): PendingMomoPaymentContext => ({
  invoiceId: value.invoiceId,
  orderId: value.orderId,
  paymentId: value.paymentId,
  requestId: value.requestId,
});

export const savePendingMomoPayment = (payment: MomoPaymentResponse) => {
  try {
    sessionStorage.setItem(
      MOMO_PAYMENT_SESSION_KEY,
      JSON.stringify(toPendingMomoPaymentContext(payment)),
    );
  } catch {
    // Payment can still continue even if browser storage is unavailable.
  }
};

export const getPendingMomoPayment = (): PendingMomoPaymentContext | null => {
  try {
    const rawValue = sessionStorage.getItem(MOMO_PAYMENT_SESSION_KEY);

    if (!rawValue) {
      return null;
    }

    const parsedValue: unknown = JSON.parse(rawValue);

    if (
      !isRecord(parsedValue) ||
      typeof parsedValue.paymentId !== 'string' ||
      typeof parsedValue.invoiceId !== 'string' ||
      typeof parsedValue.orderId !== 'string' ||
      typeof parsedValue.requestId !== 'string'
    ) {
      return null;
    }

    return {
      invoiceId: parsedValue.invoiceId,
      orderId: parsedValue.orderId,
      paymentId: parsedValue.paymentId,
      requestId: parsedValue.requestId,
    };
  } catch {
    return null;
  }
};

export const clearPendingMomoPayment = () => {
  try {
    sessionStorage.removeItem(MOMO_PAYMENT_SESSION_KEY);
  } catch {
    // Ignore storage failures because this is only temporary redirect context.
  }
};
