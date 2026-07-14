import type { Dayjs } from 'dayjs';

import type { FilterParams } from '@/shared/types/filter-params-type';

export type StaffLeaveRequestStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface StaffLeaveRequest {
  id: number;
  reason: string;
  status: StaffLeaveRequestStatus | string;
  blockedDate: string | null;
  startTime: string | null;
  endTime: string | null;
}

export interface StaffLeaveRequestFilterParams extends FilterParams {
  keyWord?: string;
  status?: StaffLeaveRequestStatus;
}

export interface CreateStaffLeaveRequestPayload {
  reason: string;
  blockedDate: string | null;
  startTime: string | null;
  endTime: string | null;
}

export interface StaffLeaveRequestFormValues {
  reason: string;
  blockedDate?: Dayjs | null;
  startTime?: Dayjs | null;
  endTime?: Dayjs | null;
  isEveryDay?: boolean;
  isAllDay?: boolean;
}
