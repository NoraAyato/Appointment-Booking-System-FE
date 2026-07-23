import type { Dayjs } from 'dayjs';

import type { FilterParams } from '@/shared/types/filter-params-type';

export type AdminBlockedSlotStatus = 'DEFAULT' | 'PENDING' | 'APPROVED' | 'REJECTED';

export interface AdminBlockedSlot {
  id: number;
  staffName: string | null;
  avatarUrl: string | null;
  reason: string;
  status: AdminBlockedSlotStatus | string;
  blockedDate: string | null;
  startTime: string | null;
  endTime: string | null;
}

export interface AdminBlockedSlotFilterParams extends FilterParams {
  keyWord?: string;
  status?: AdminBlockedSlotStatus;
}

export interface CreateAdminBlockedSlotPayload {
  userId?: string | null;
  reason: string;
  blockedDate: string | null;
  startTime: string | null;
  endTime: string | null;
  status: AdminBlockedSlotStatus;
}

export interface UpdateAdminBlockedSlotStatusPayload {
  status: AdminBlockedSlotStatus;
}

export interface AdminBlockedSlotFormValues {
  userId?: string;
  reason: string;
  blockedDate?: Dayjs | null;
  startTime?: Dayjs | null;
  endTime?: Dayjs | null;
  status: AdminBlockedSlotStatus;
  isEveryDay?: boolean;
  isAllDay?: boolean;
}
