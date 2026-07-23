import { axiosClient } from '@/shared/lib/axios';
import type { ApiMessageResponse, ApiResponse, PaginatedData } from '@/shared/types/api-type';

import type {
  AdminPromotion,
  AdminPromotionBasePayload,
  AdminPromotionFilterParams,
  CreateAdminPromotionPayload,
  UpdateAdminPromotionPayload,
} from '../types/admin-promotion-type';

const API_URL_PREFIX = '/admin/promotions';

const toPromotionFormData = (payload: AdminPromotionBasePayload) => {
  const formData = new FormData();

  formData.append('promotionCode', payload.promotionCode);
  formData.append('description', payload.description);
  formData.append('discountAmount', String(payload.discountAmount));
  formData.append('discountType', payload.discountType);
  formData.append('startDate', payload.startDate);
  formData.append('endDate', payload.endDate);

  if (payload.image) {
    formData.append('image', payload.image);
  }

  return formData;
};

const toUpdatePromotionFormData = (payload: UpdateAdminPromotionPayload) => {
  const formData = toPromotionFormData(payload);

  formData.append('status', payload.status);

  return formData;
};

export const adminPromotionRoleAdminApi = {
  getAll: async ({
    discountType,
    fromDate,
    keyword,
    limit,
    page,
    status,
    toDate,
  }: AdminPromotionFilterParams) => {
    const response = await axiosClient.get<ApiResponse<PaginatedData<AdminPromotion>>>(
      API_URL_PREFIX,
      {
        params: {
          discountType,
          fromDate,
          keyword,
          page,
          size: limit,
          status,
          toDate,
        },
      },
    );

    return response.data;
  },

  create: async (payload: CreateAdminPromotionPayload) => {
    const response = await axiosClient.post<ApiMessageResponse>(
      API_URL_PREFIX,
      toPromotionFormData(payload),
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      },
    );

    return response.data;
  },

  update: async (id: string, payload: UpdateAdminPromotionPayload) => {
    const response = await axiosClient.put<ApiMessageResponse>(
      `${API_URL_PREFIX}/${id}`,
      toUpdatePromotionFormData(payload),
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      },
    );

    return response.data;
  },
};
