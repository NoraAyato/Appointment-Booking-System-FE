import type { AdminBlockedSlotStatus } from '../types/admin-blocked-slot-type';

export const ADMIN_BLOCKED_SLOT_STATUS_OPTIONS: Array<{
  label: string;
  value: AdminBlockedSlotStatus;
}> = [
  { label: 'Mặc định', value: 'DEFAULT' },
  { label: 'Chờ duyệt', value: 'PENDING' },
  { label: 'Đã duyệt', value: 'APPROVED' },
  { label: 'Từ chối', value: 'REJECTED' },
];

export const ADMIN_BLOCKED_SLOT_MANUAL_STATUS_OPTIONS = ADMIN_BLOCKED_SLOT_STATUS_OPTIONS.filter(
  (option) => option.value !== 'DEFAULT',
);

export const ADMIN_BLOCKED_SLOT_DEFAULT_STATUS_OPTIONS = ADMIN_BLOCKED_SLOT_STATUS_OPTIONS.filter(
  (option) => option.value === 'DEFAULT',
);

export const getAdminBlockedSlotStatusMeta = (status?: string) => {
  switch (status) {
    case 'DEFAULT':
      return {
        color: 'default',
        label: 'Mặc định',
      };
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
        label: status ? 'Chờ duyệt' : 'Chưa cập nhật',
      };
  }
};
