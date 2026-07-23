import { axiosClient } from '@/shared/lib/axios';

import type { ApiMessageResponse, ApiResponse, PaginatedData } from '@/shared/types/api-type';
import type {
  AdminCategory,
  AdminCategoryFilterParams,
  AdminCategoryPayload,
} from '../types/admin-category-type';

const API_URL_PREFIX = '/admin/categories';

export const adminCategoryRoleAdminApi = {
  getAll: async ({ limit, page, keyword }: AdminCategoryFilterParams) => {
    const response = await axiosClient.get<ApiResponse<PaginatedData<AdminCategory>>>(
      API_URL_PREFIX,
      {
        params: {
          keyword,
          page,
          size: limit,
        },
      },
    );

    return response.data;
  },

  create: async (payload: AdminCategoryPayload) => {
    const response = await axiosClient.post<ApiMessageResponse>(API_URL_PREFIX, payload);

    return response.data;
  },

  update: async (id: string, payload: AdminCategoryPayload) => {
    const response = await axiosClient.put<ApiMessageResponse>(`${API_URL_PREFIX}/${id}`, payload);

    return response.data;
  },

  remove: async (id: string) => {
    const response = await axiosClient.delete<ApiMessageResponse>(`${API_URL_PREFIX}/${id}`);

    return response.data;
  },
};
