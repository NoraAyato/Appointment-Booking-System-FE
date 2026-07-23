export type AdminDashboardAppointmentStatus =
  | 'PENDING'
  | 'CONFIRMED'
  | 'COMPLETED'
  | 'CANCELLED';

export interface AdminDashboardStaffPerformance {
  staffId: string;
  staffName: string;
  completedAppointments: number;
  cancelledAppointments: number;
  averageRating: number;
  totalWorkingHours: number;
}

export interface AdminDashboardTopService {
  serviceId: string;
  serviceName: string;
  bookingCount: number;
  revenue: number;
  averageRating: number;
}

export interface AdminDashboardRevenuePoint {
  date: string;
  revenue: number;
  invoiceCount: number;
}

export interface AdminDashboardOverview {
  totalAppointments: number;
  pendingAppointments: number;
  confirmedAppointments: number;
  completedAppointments: number;
  cancelledAppointments: number;
  totalRevenue: number;
  paidInvoices: number;
  newCustomers: number;
  activeServices: number;
  activeStaff: number;
  pendingReviews: number;
  averageRating: number;
}

export interface AdminDashboardUpcomingAppointment {
  appointmentId: string;
  customerName: string;
  serviceName: string;
  staffName: string;
  startTime: string;
  endTime: string;
  status: AdminDashboardAppointmentStatus | string;
}

export interface AdminDashboardAppointmentStatusSummary {
  status: AdminDashboardAppointmentStatus;
  count: number;
}

export interface AdminDashboardAppointmentDaily {
  date: string;
  total: number;
  completed: number;
  cancelled: number;
}

export interface AdminDashboardAlerts {
  pendingStaffShifts: number;
  pendingBlockedSlots: number;
  pendingReviews: number;
  servicesWithoutStaff: number;
  staffWithoutShiftToday: number;
}

export interface AdminDashboardDateRangeParams {
  fromDate?: string;
  toDate?: string;
}

export interface AdminDashboardLimitParams {
  limit?: number;
}

export interface AdminDashboardDateRangeLimitParams
  extends AdminDashboardDateRangeParams,
    AdminDashboardLimitParams {}
