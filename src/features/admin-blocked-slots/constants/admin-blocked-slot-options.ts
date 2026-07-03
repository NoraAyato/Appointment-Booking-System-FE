import type { AdminBlockedSlotStatus } from '../types/admin-blocked-slot-type';

export const ADMIN_BLOCKED_SLOT_STATUS_OPTIONS: Array<{
  label: string;
  value: AdminBlockedSlotStatus;
}> = [
  { label: 'Chờ duyệt', value: 'PENDING' },
  { label: 'Đã duyệt', value: 'APPROVED' },
  { label: 'Từ chối', value: 'REJECTED' },
];

export const getAdminBlockedSlotStatusMeta = (status?: string) => {
  switch (status) {
    case 'APPROVED':
      return {
        color: 'green',
        label: 'Đã duyệt',
      };
    case 'REJECTED':
      return {
        color: 'red',
        label: 'Từ chối',
      };
    case 'PENDING':
    default:
      return {
        color: 'gold',
        label: 'Chờ duyệt',
      };
  }
};
