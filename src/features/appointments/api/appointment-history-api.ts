import { axiosClient } from '@/shared/lib/axios';
import type { ApiResponse, PaginatedData } from '@/shared/types/api-type';
import { getAssetUrl } from '@/shared/utils/asset-url';

import type {
  AppointmentHistoryFilterParams,
  AppointmentHistoryItem,
  AppointmentHistoryModel,
} from '../types/appointment-type';

const APPOINTMENT_HISTORY_API_PREFIX = '/appointments/history';

const toAppointmentHistoryModel = (
  appointment: AppointmentHistoryItem,
): AppointmentHistoryModel => ({
  ...appointment,
  serviceImageUrl: getAssetUrl(appointment.serviceImage),
  staffAvatarUrl: getAssetUrl(appointment.staffAvatar),
});

const toAppointmentHistoryResponse = (
  response: ApiResponse<PaginatedData<AppointmentHistoryItem>>,
): ApiResponse<PaginatedData<AppointmentHistoryModel>> => ({
  ...response,
  data: {
    ...response.data,
    items: response.data.items.map(toAppointmentHistoryModel),
  },
});

export const appointmentHistoryApi = {
  getAll: async (params: AppointmentHistoryFilterParams) => {
    const response = await axiosClient.get<ApiResponse<PaginatedData<AppointmentHistoryItem>>>(
      APPOINTMENT_HISTORY_API_PREFIX,
      {
        params,
      },
    );

    return toAppointmentHistoryResponse(response.data);
  },
};
