import { axiosClient } from '@/shared/lib/axios';
import type { ApiMessageResponse, ApiResponse, PaginatedData } from '@/shared/types/api-type';

import type {
  AdminBlockedSlot,
  AdminBlockedSlotFilterParams,
  CreateAdminBlockedSlotPayload,
  UpdateAdminBlockedSlotStatusPayload,
} from '../types/admin-blocked-slot-type';

const API_URL_PREFIX = '/admin/blocked-slots';

export const adminBlockedSlotRoleAdminApi = {
  getAll: async (params: AdminBlockedSlotFilterParams) => {
    const response = await axiosClient.get<ApiResponse<PaginatedData<AdminBlockedSlot>>>(
      API_URL_PREFIX,
      {
        params,
      },
    );

    return response.data;
  },

  create: async (payload: CreateAdminBlockedSlotPayload) => {
    const response = await axiosClient.post<ApiMessageResponse>(API_URL_PREFIX, payload);

    return response.data;
  },

  updateStatus: async (id: number, payload: UpdateAdminBlockedSlotStatusPayload) => {
    const response = await axiosClient.put<ApiMessageResponse>(
      `${API_URL_PREFIX}/update/${id}`,
      payload,
    );

    return response.data;
  },

  remove: async (id: number) => {
    const response = await axiosClient.delete<ApiMessageResponse>(`${API_URL_PREFIX}/${id}`);

    return response.data;
  },
};
