import type {
  StaffAppointmentStatus,
  StaffApprovalStatus,
  StaffDashboardOverview,
  StaffScheduleEventType,
} from '../types/staff-dashboard-type';

export const STAFF_CONFIRMED_APPOINTMENT_STATUS: StaffAppointmentStatus = 'CONFIRM';

export const emptyStaffDashboardOverview: StaffDashboardOverview = {
  cancelledAppointments: 0,
  completedAppointments: 0,
  confirmedAppointments: 0,
  pendingAppointments: 0,
  totalAppointments: 0,
  totalBlockedSlots: 0,
  totalWorkingHours: 0,
};

export const STAFF_APPROVAL_STATUS_OPTIONS: Array<{
  label: string;
  value: StaffApprovalStatus;
}> = [
  { label: 'Chờ duyệt', value: 'PENDING' },
  { label: 'Đã duyệt', value: 'APPROVED' },
  { label: 'Từ chối', value: 'REJECTED' },
];

export const staffApprovalStatusMeta: Record<
  StaffApprovalStatus,
  {
    color: string;
    label: string;
  }
> = {
  APPROVED: {
    color: 'green',
    label: 'Đã duyệt',
  },
  PENDING: {
    color: 'gold',
    label: 'Chờ duyệt',
  },
  REJECTED: {
    color: 'red',
    label: 'Từ chối',
  },
};

export const staffAppointmentStatusMeta: Record<
  StaffAppointmentStatus,
  {
    color: string;
    label: string;
  }
> = {
  CANCELLED: {
    color: 'red',
    label: 'Đã hủy',
  },
  COMPLETED: {
    color: 'green',
    label: 'Hoàn tất',
  },
  CONFIRM: {
    color: 'blue',
    label: 'Đã xác nhận',
  },
  CONFIRMED: {
    color: 'blue',
    label: 'Đã xác nhận',
  },
  PENDING: {
    color: 'gold',
    label: 'Chờ xác nhận',
  },
};

export const staffScheduleEventMeta: Record<
  StaffScheduleEventType,
  {
    color: string;
    label: string;
  }
> = {
  APPOINTMENT: {
    color: '#0EA5E9',
    label: 'Lịch hẹn',
  },
  BLOCKED_SLOT: {
    color: '#DE7D62',
    label: 'Khóa lịch',
  },
  SHIFT: {
    color: '#2F7D67',
    label: 'Ca làm',
  },
};

export const getStaffApprovalStatusMeta = (status?: string) =>
  staffApprovalStatusMeta[status as StaffApprovalStatus] ?? {
    color: 'default',
    label: status || 'Chưa cập nhật',
  };

export const getStaffAppointmentStatusMeta = (status?: string) =>
  staffAppointmentStatusMeta[status as StaffAppointmentStatus] ?? {
    color: 'default',
    label: status || 'Chưa cập nhật',
  };
