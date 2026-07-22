import type { AppointmentHistoryFilterParams } from '../types/appointment-type';

export const appointmentQueryKeys = {
  all: ['appointments'] as const,
  history: (params: AppointmentHistoryFilterParams) =>
    [...appointmentQueryKeys.all, 'history', params] as const,
};
