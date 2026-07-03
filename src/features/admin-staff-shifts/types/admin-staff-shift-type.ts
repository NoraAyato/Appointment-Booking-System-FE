import type { Dayjs } from 'dayjs';

import type { FilterParams } from '@/shared/types/filter-params-type';

export type AdminStaffShiftStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface AdminStaffShift {
  id: number;
  workDate: string;
  startTime: string;
  endTime: string;
  status: AdminStaffShiftStatus | string;
  staffName: string;
  staffAvatar: string;
  serviceNames: string[];
}

export interface AdminStaffShiftFilterParams extends FilterParams {
  keyWord?: string;
  status?: AdminStaffShiftStatus;
}

export interface CreateAdminStaffShiftPayload {
  staffId: string;
  workDate: string;
  startTime: string;
  endTime: string;
}

export interface UpdateAdminStaffShiftPayload extends CreateAdminStaffShiftPayload {
  status: AdminStaffShiftStatus;
}

export interface AdminStaffShiftFormValues {
  staffId: string;
  workDate: Dayjs;
  startTime: Dayjs;
  endTime: Dayjs;
  status?: AdminStaffShiftStatus;
}
