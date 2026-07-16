import { axiosClient } from '@/shared/lib/axios';
import type { ApiResponse } from '@/shared/types/api-type';

import type {
  ApplyPromotionPayload,
  ApplyPromotionResponse,
  InvoiceDetail,
} from '../types/invoice-type';

const INVOICE_API_PREFIX = '/invoices';

export const invoiceApi = {
  getDetail: async (invoiceId: string) => {
    const response = await axiosClient.get<ApiResponse<InvoiceDetail>>(
      `${INVOICE_API_PREFIX}/${invoiceId}`,
    );

    return response.data;
  },

  applyPromotion: async (invoiceId: string, payload: ApplyPromotionPayload) => {
    const response = await axiosClient.put<ApiResponse<ApplyPromotionResponse>>(
      `${INVOICE_API_PREFIX}/apply-promotion/${invoiceId}`,
      payload,
    );

    return response.data;
  },
};
