import { axiosClient } from '@/shared/lib/axios';

import type { ApiResponse, PaginatedData } from '@/shared/types/api-type';
import type {
  AdminUser,
  AdminUserFilterParams,
  AdminUserStats,
  UpdateUserInfoPayload,
} from '../types/admin-user-type';

const API_URL_PREFIX = '/admin/users';

export const adminUserRoleAdminApi = {
  getAll: async (params: AdminUserFilterParams) => {
    const response = await axiosClient.get<ApiResponse<PaginatedData<AdminUser>>>(API_URL_PREFIX, {
      params,
    });

    return response.data;
  },

  getStats: async () => {
    const response = await axiosClient.get<ApiResponse<AdminUserStats>>(`${API_URL_PREFIX}/stats`);

    return response.data;
  },

  update: async (id: string, payload: UpdateUserInfoPayload) => {
    const response = await axiosClient.put<ApiResponse<null>>(
      `${API_URL_PREFIX}/update/${id}`,
      payload,
    );

    return response.data;
  },
};
