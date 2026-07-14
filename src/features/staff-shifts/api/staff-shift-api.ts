import { axiosClient } from '@/shared/lib/axios';
import type { ApiMessageResponse, ApiResponse, PaginatedData } from '@/shared/types/api-type';

import type {
  CreateStaffShiftPayload,
  StaffShift,
  StaffShiftFilterParams,
} from '../types/staff-shift-type';

const API_URL_PREFIX = '/staff/staff-shifts';

export const staffShiftRoleStaffApi = {
  getAll: async (params: StaffShiftFilterParams) => {
    const response = await axiosClient.get<ApiResponse<PaginatedData<StaffShift>>>(
      API_URL_PREFIX,
      {
        params,
      },
    );

    return response.data;
  },

  create: async (payload: CreateStaffShiftPayload) => {
    const response = await axiosClient.post<ApiMessageResponse>(API_URL_PREFIX, payload);

    return response.data;
  },
};
