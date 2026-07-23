import type { AdminStaffShiftStatus } from '../types/admin-staff-shift-type';

export const ADMIN_STAFF_SHIFT_STATUS_OPTIONS: Array<{
  label: string;
  value: AdminStaffShiftStatus;
}> = [
  { label: 'Chờ duyệt', value: 'PENDING' },
  { label: 'Đã duyệt', value: 'APPROVED' },
  { label: 'Từ chối', value: 'REJECTED' },
];

export const getAdminStaffShiftStatusMeta = (status?: string) => {
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
