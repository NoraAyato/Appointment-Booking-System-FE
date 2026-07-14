export type StaffApprovalStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export type StaffAppointmentStatus =
  | 'PENDING'
  | 'CONFIRM'
  | 'CONFIRMED'
  | 'CANCELLED'
  | 'COMPLETED';

export type StaffScheduleEventType = 'SHIFT' | 'APPOINTMENT' | 'BLOCKED_SLOT';

export interface StaffDashboardDateRangeParams {
  fromDate?: string;
  toDate?: string;
}

export interface StaffScheduleEvent {
  type: StaffScheduleEventType;
  shiftId: number | null;
  blockedSlotId: number | null;
  appointmentDetailId: number | null;
  appointmentId: string | null;
  date: string;
  startTime: string | null;
  endTime: string | null;
  status: StaffApprovalStatus | StaffAppointmentStatus | string;
  title: string;
  serviceId: string | null;
  serviceName: string | null;
  customerName: string | null;
  customerPhone: string | null;
  reason: string | null;
}

export interface StaffDashboardOverview {
  totalAppointments: number;
  pendingAppointments: number;
  confirmedAppointments: number;
  completedAppointments: number;
  cancelledAppointments: number;
  totalWorkingHours: number;
  totalBlockedSlots: number;
}
