import { axiosClient } from '@/shared/lib/axios';
import type { ApiResponse } from '@/shared/types/api-type';

import type { MomoPaymentResponse, PaymentDetail } from '../types/payment-type';

const PAYMENT_API_PREFIX = '/payments';

export const paymentApi = {
  createMomoPayment: async (invoiceId: string) => {
    const response = await axiosClient.post<ApiResponse<MomoPaymentResponse>>(
      `${PAYMENT_API_PREFIX}/momo/${invoiceId}`,
    );

    return response.data;
  },

  getPayment: async (paymentId: string) => {
    const response = await axiosClient.get<ApiResponse<PaymentDetail>>(
      `${PAYMENT_API_PREFIX}/${paymentId}`,
    );

    return response.data;
  },

  getLatestInvoicePayment: async (invoiceId: string) => {
    const response = await axiosClient.get<ApiResponse<PaymentDetail>>(
      `${PAYMENT_API_PREFIX}/invoice/${invoiceId}/latest`,
    );

    return response.data;
  },
};
