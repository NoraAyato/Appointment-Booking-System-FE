import { axiosClient } from '@/shared/lib/axios';
import type { ApiMessageResponse, ApiResponse, PaginatedData } from '@/shared/types/api-type';

import type {
  CompleteStaffAppointmentPayload,
  StaffAppointment,
  StaffAppointmentFilterParams,
} from '../types/staff-appointment-type';

const API_URL_PREFIX = '/staff/appointments';

const toCompleteAppointmentFormData = (payload: CompleteStaffAppointmentPayload) => {
  const formData = new FormData();

  formData.append('picture', payload.picture);

  return formData;
};

export const staffAppointmentRoleStaffApi = {
  getAll: async (params: StaffAppointmentFilterParams) => {
    const response = await axiosClient.get<ApiResponse<PaginatedData<StaffAppointment>>>(
      API_URL_PREFIX,
      {
        params,
      },
    );

    return response.data;
  },

  complete: async (appointmentId: string, payload: CompleteStaffAppointmentPayload) => {
    const response = await axiosClient.put<ApiMessageResponse>(
      `${API_URL_PREFIX}/${appointmentId}/complete`,
      toCompleteAppointmentFormData(payload),
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      },
    );

    return response.data;
  },
};
