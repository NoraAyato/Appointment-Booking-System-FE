export type AppointmentStatus = 'confirmed' | 'pending' | 'completed' | 'cancelled';

export interface Specialist {
  id: string;
  fullName: string;
  title: string;
  avatarUrl: string;
  availableServiceIds: string[];
}

export interface Appointment {
  id: string;
  serviceName: string;
  specialistName: string;
  scheduledAt: string;
  status: AppointmentStatus;
  location: string;
  price: number;
}

export interface BookingPayload {
  serviceId: string;
  specialistId: string;
  date: string;
  time: string;
  note?: string;
}

export interface CreateAppointmentHoldPayload {
  serviceId: string;
  staffId: string;
  date: string;
  time: string;
}

export interface AppointmentHoldResponse {
  holdToken: string;
  expiresInSeconds: number;
  startTime: string;
  endTime: string;
}

export interface ConfirmAppointmentPayload {
  holdToken: string;
  note?: string;
}

export interface AppointmentCreatedResponse {
  appointmentId: string;
  appointmentDetailId: number;
  invoiceId: string;
  serviceId: string;
  staffId: string;
  startTime: string;
  endTime: string;
  quantity: number;
  status: string;
}

export interface AppointmentBookingServiceSnapshot {
  accentColor: string;
  category: string;
  description: string;
  durationMinutes: number;
  id: string;
  imageUrl?: string;
  imageUrls: string[];
  location: string;
  name: string;
  price: number;
  rating: number;
}

export interface AppointmentBookingStaffSnapshot {
  avatarUrl?: string;
  completedServices: number;
  id: string;
  name: string;
  rating: number;
  specialties: string[];
}

export interface AppointmentBookingConfirmState {
  hold: AppointmentHoldResponse;
  service: AppointmentBookingServiceSnapshot;
  staff: AppointmentBookingStaffSnapshot;
}

export type AppointmentHistoryStatus = 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';
export type AppointmentHistoryInvoiceStatus = 'PAID' | 'UNPAID' | 'CANCELLED' | 'REFUNDED';
export type AppointmentHistoryPaymentStatus = 'PENDING' | 'PAID' | 'FAILED' | 'CANCELLED';
export type AppointmentHistoryPaymentMethod = 'MOMO' | 'CASH';

export interface AppointmentHistoryItem {
  appointmentDetailId: number;
  appointmentId: string;
  appointmentStatus: AppointmentHistoryStatus;
  bookingDate: string;
  categoryColorTag: string;
  categoryName: string;
  durationMinutes: number;
  endTime: string;
  invoiceAmount: number;
  invoiceId: string;
  invoiceStatus: AppointmentHistoryInvoiceStatus;
  note: string | null;
  paymentMethod: AppointmentHistoryPaymentMethod | null;
  paymentStatus: AppointmentHistoryPaymentStatus | null;
  promotionCode: string | null;
  quantity: number;
  reviewed: boolean;
  serviceId: string;
  serviceImage: string | null;
  serviceName: string;
  staffAvatar: string | null;
  staffId: string;
  staffName: string;
  startTime: string;
}

export interface AppointmentHistoryModel extends AppointmentHistoryItem {
  serviceImageUrl?: string;
  staffAvatarUrl?: string;
}

export interface AppointmentHistoryFilterParams {
  page: number;
  limit: number;
}
