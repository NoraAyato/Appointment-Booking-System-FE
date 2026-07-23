import { axiosClient } from '@/shared/lib/axios';
import type { ApiResponse } from '@/shared/types/api-type';

import type {
  AppointmentCreatedResponse,
  AppointmentHoldResponse,
  ConfirmAppointmentPayload,
  CreateAppointmentHoldPayload,
} from '../types/appointment-type';

const APPOINTMENT_API_PREFIX = '/appointments';

export const appointmentBookingApi = {
  holdSlot: async (payload: CreateAppointmentHoldPayload) => {
    const response = await axiosClient.post<ApiResponse<AppointmentHoldResponse>>(
      `${APPOINTMENT_API_PREFIX}/holds`,
      payload,
    );

    return response.data;
  },

  confirmBooking: async (payload: ConfirmAppointmentPayload) => {
    const response = await axiosClient.post<ApiResponse<AppointmentCreatedResponse>>(
      APPOINTMENT_API_PREFIX,
      payload,
    );

    return response.data;
  },
};
