import { axiosClient } from '@/shared/lib/axios';
import type { ApiMessageResponse, ApiResponse, PaginatedData } from '@/shared/types/api-type';

import type {
  AdminReview,
  AdminReviewFilterParams,
  UpdateAdminReviewStatusPayload,
} from '../types/admin-review-type';

const API_URL_PREFIX = '/admin/reviews';

export const adminReviewRoleAdminApi = {
  getAll: async (params: AdminReviewFilterParams) => {
    const response = await axiosClient.get<ApiResponse<PaginatedData<AdminReview>>>(
      API_URL_PREFIX,
      {
        params,
      },
    );

    return response.data;
  },

  updateStatus: async (id: string, payload: UpdateAdminReviewStatusPayload) => {
    const response = await axiosClient.put<ApiMessageResponse>(
      `${API_URL_PREFIX}/update/${id}`,
      payload,
    );

    return response.data;
  },
};
