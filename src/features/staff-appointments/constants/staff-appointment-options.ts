import type { StaffAppointmentStatus } from '../types/staff-appointment-type';

export const STAFF_APPOINTMENT_STATUS_OPTIONS: Array<{
  label: string;
  value: StaffAppointmentStatus;
}> = [
  { label: 'Đã xác nhận', value: 'CONFIRMED' },
  { label: 'Hoàn tất', value: 'COMPLETED' },
];

export const getStaffAppointmentStatusMeta = (status?: string) => {
  switch (status) {
    case 'CONFIRMED':
      return {
        color: 'blue',
        label: 'Đã xác nhận',
      };
    case 'COMPLETED':
      return {
        color: 'green',
        label: 'Hoàn tất',
      };
    case 'CANCELLED':
      return {
        color: 'red',
        label: 'Đã hủy',
      };
    case 'PENDING':
      return {
        color: 'gold',
        label: 'Chờ xác nhận',
      };
    default:
      return {
        color: 'default',
        label: status || 'Chưa cập nhật',
      };
  }
};
