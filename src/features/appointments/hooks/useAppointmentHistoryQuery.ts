import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { unwrapApiResponse } from '@/shared/utils/api-response';

import { appointmentHistoryApi } from '../api/appointment-history-api';
import { appointmentQueryKeys } from '../constants/appointment-query-keys';
import type { AppointmentHistoryFilterParams } from '../types/appointment-type';

export const useAppointmentHistoryQuery = (params: AppointmentHistoryFilterParams) =>
  useQuery({
    placeholderData: keepPreviousData,
    queryFn: async () => {
      const response = await appointmentHistoryApi.getAll(params);

      return unwrapApiResponse(response, 'Không thể tải lịch sử đặt dịch vụ.');
    },
    queryKey: appointmentQueryKeys.history(params),
  });
