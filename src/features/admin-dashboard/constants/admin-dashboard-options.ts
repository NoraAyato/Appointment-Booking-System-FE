import type {
  AdminDashboardAlerts,
  AdminDashboardAppointmentStatus,
} from '../types/admin-dashboard-type';

export const emptyAdminDashboardAlerts: AdminDashboardAlerts = {
  pendingBlockedSlots: 0,
  pendingReviews: 0,
  pendingStaffShifts: 0,
  servicesWithoutStaff: 0,
  staffWithoutShiftToday: 0,
};

export const adminDashboardLimitOptions = [
  { label: 'Top 3', value: 3 },
  { label: 'Top 5', value: 5 },
  { label: 'Top 10', value: 10 },
];

export const appointmentStatusLabels: Record<AdminDashboardAppointmentStatus, string> = {
  CANCELLED: 'Đã hủy',
  COMPLETED: 'Hoàn tất',
  CONFIRMED: 'Đã xác nhận',
  PENDING: 'Chờ xác nhận',
};

export const appointmentStatusColors: Record<AdminDashboardAppointmentStatus, string> = {
  CANCELLED: '#DE7D62',
  COMPLETED: '#2F7D67',
  CONFIRMED: '#0EA5E9',
  PENDING: '#D99530',
};
