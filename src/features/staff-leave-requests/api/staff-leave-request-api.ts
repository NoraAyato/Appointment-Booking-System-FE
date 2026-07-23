import { axiosClient } from '@/shared/lib/axios';
import type { ApiMessageResponse, ApiResponse, PaginatedData } from '@/shared/types/api-type';

import type {
  CreateStaffLeaveRequestPayload,
  StaffLeaveRequest,
  StaffLeaveRequestFilterParams,
} from '../types/staff-leave-request-type';

const API_URL_PREFIX = '/staff/blocked-slots';

export const staffLeaveRequestRoleStaffApi = {
  getAll: async (params: StaffLeaveRequestFilterParams) => {
    const response = await axiosClient.get<ApiResponse<PaginatedData<StaffLeaveRequest>>>(
      API_URL_PREFIX,
      {
        params,
      },
    );

    return response.data;
  },

  create: async (payload: CreateStaffLeaveRequestPayload) => {
    const response = await axiosClient.post<ApiMessageResponse>(API_URL_PREFIX, payload);

    return response.data;
  },
};
