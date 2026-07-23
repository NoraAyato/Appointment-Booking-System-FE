import { axiosClient } from '@/shared/lib/axios';
import type { ApiMessageResponse, ApiResponse, PaginatedData } from '@/shared/types/api-type';

import type {
  AdminStaffShift,
  AdminStaffShiftFilterParams,
  CreateAdminStaffShiftPayload,
  UpdateAdminStaffShiftPayload,
} from '../types/admin-staff-shift-type';

const API_URL_PREFIX = '/admin/staff-shifts';

export const adminStaffShiftRoleAdminApi = {
  getAll: async (params: AdminStaffShiftFilterParams) => {
    const response = await axiosClient.get<ApiResponse<PaginatedData<AdminStaffShift>>>(
      API_URL_PREFIX,
      {
        params,
      },
    );

    return response.data;
  },

  create: async (payload: CreateAdminStaffShiftPayload) => {
    const response = await axiosClient.post<ApiMessageResponse>(API_URL_PREFIX, payload);

    return response.data;
  },

  update: async (id: number, payload: UpdateAdminStaffShiftPayload) => {
    const response = await axiosClient.put<ApiMessageResponse>(
      `${API_URL_PREFIX}/${id}`,
      payload,
    );

    return response.data;
  },
};
