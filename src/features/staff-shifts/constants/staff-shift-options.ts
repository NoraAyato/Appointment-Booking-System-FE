import type { StaffShiftStatus } from '../types/staff-shift-type';

export const STAFF_SHIFT_STATUS_OPTIONS: Array<{
  label: string;
  value: StaffShiftStatus;
}> = [
  { label: 'Chờ duyệt', value: 'PENDING' },
  { label: 'Đã duyệt', value: 'APPROVED' },
  { label: 'Từ chối', value: 'REJECTED' },
];

export const getStaffShiftStatusMeta = (status?: string) => {
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
        label: status ? 'Chờ duyệt' : 'Chưa cập nhật',
      };
  }
};
