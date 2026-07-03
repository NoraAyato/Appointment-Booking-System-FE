import type { FilterParams } from '@/shared/types/filter-params-type';

export type AdminStaffServiceStatus = 'ACTIVE' | 'BLOCKED';

export interface AdminStaffService {
  id: number;
  staffName: string;
  staffAvatar: string;
  serviceName: string;
  status: AdminStaffServiceStatus | string;
}

export interface AdminStaffServiceFilterParams extends FilterParams {
  keyword?: string;
  status?: AdminStaffServiceStatus;
}

export interface CreateAdminStaffServicePayload {
  staffId: string;
  serviceId: string;
}

export interface AdminStaffServiceFormValues {
  staffId: string;
  serviceId: string;
}
