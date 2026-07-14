import type { Dayjs } from 'dayjs';

import type { FilterParams } from '@/shared/types/filter-params-type';

export type StaffShiftStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface StaffShift {
  id: number;
  workDate: string;
  startTime: string;
  endTime: string;
  status: StaffShiftStatus | string;
  serviceNames: string[];
}

export interface StaffShiftFilterParams extends FilterParams {
  keyWord?: string;
  status?: StaffShiftStatus;
}

export interface CreateStaffShiftPayload {
  workDate: string;
  startTime: string;
  endTime: string;
}

export interface StaffShiftFormValues {
  workDate: Dayjs;
  startTime: Dayjs;
  endTime: Dayjs;
}
