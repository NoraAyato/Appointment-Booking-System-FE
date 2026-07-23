import { axiosClient } from '@/shared/lib/axios';
import type { ApiMessageResponse, ApiResponse, PaginatedData } from '@/shared/types/api-type';

import type {
  AdminStaffService,
  AdminStaffServiceFilterParams,
  CreateAdminStaffServicePayload,
} from '../types/admin-staff-service-type';

const API_URL_PREFIX = '/admin/staff-services';

export const adminStaffServiceRoleAdminApi = {
  getAll: async (params: AdminStaffServiceFilterParams) => {
    const response = await axiosClient.get<ApiResponse<PaginatedData<AdminStaffService>>>(
      API_URL_PREFIX,
      {
        params,
      },
    );

    return response.data;
  },

  create: async (payload: CreateAdminStaffServicePayload) => {
    const response = await axiosClient.post<ApiMessageResponse>(API_URL_PREFIX, payload);

    return response.data;
  },

  remove: async (id: number) => {
    const response = await axiosClient.delete<ApiMessageResponse>(`${API_URL_PREFIX}/${id}`);

    return response.data;
  },
};
