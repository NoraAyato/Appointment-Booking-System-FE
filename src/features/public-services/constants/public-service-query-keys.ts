import type {
  PublicServiceAvailableTimeSlotFilterParams,
  PublicServiceFilterParams,
  PublicServiceStaffFilterParams,
} from '../types/public-service-type';

export const publicServiceQueryKeys = {
  all: ['public-services'] as const,
  availableStaff: (params: PublicServiceStaffFilterParams) =>
    [...publicServiceQueryKeys.all, 'available-staff', params] as const,
  availableTimeSlots: (params: PublicServiceAvailableTimeSlotFilterParams) =>
    [...publicServiceQueryKeys.all, 'available-time-slots', params] as const,
  categories: () => [...publicServiceQueryKeys.all, 'categories'] as const,
  detail: (serviceId?: string) => [...publicServiceQueryKeys.all, 'detail', serviceId] as const,
  list: (params: PublicServiceFilterParams) =>
    [...publicServiceQueryKeys.all, 'list', params] as const,
  topRated: () => [...publicServiceQueryKeys.all, 'top-rated'] as const,
};
