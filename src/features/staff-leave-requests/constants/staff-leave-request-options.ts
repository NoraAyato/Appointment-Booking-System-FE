import type { StaffLeaveRequestStatus } from '../types/staff-leave-request-type';

export const STAFF_LEAVE_REQUEST_STATUS_OPTIONS: Array<{
  label: string;
  value: StaffLeaveRequestStatus;
}> = [
  { label: 'Chờ duyệt', value: 'PENDING' },
  { label: 'Đã duyệt', value: 'APPROVED' },
  { label: 'Từ chối', value: 'REJECTED' },
];

export const getStaffLeaveRequestStatusMeta = (status?: string) => {
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
