import type { Dayjs } from 'dayjs';

import type { FilterParams } from '@/shared/types/filter-params-type';

export type AdminBlockedSlotStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface AdminBlockedSlot {
  id: number;
  staffName: string;
  avatarUrl: string;
  reason: string;
  status: AdminBlockedSlotStatus | string;
  blockedDate: string;
  startTime: string;
  endTime: string;
}

export interface AdminBlockedSlotFilterParams extends FilterParams {
  keyWord?: string;
  status?: AdminBlockedSlotStatus;
}

export interface CreateAdminBlockedSlotPayload {
  userId?: string;
  reason: string;
  blockedDate: string;
  startTime: string;
  endTime: string;
  status: AdminBlockedSlotStatus;
}

export interface UpdateAdminBlockedSlotStatusPayload {
  status: AdminBlockedSlotStatus;
}

export interface AdminBlockedSlotFormValues {
  userId?: string;
  reason: string;
  blockedDate: Dayjs;
  startTime: Dayjs;
  endTime: Dayjs;
  status: AdminBlockedSlotStatus;
}
