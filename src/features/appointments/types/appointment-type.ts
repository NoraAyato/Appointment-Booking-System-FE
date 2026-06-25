export type AppointmentStatus = 'confirmed' | 'pending' | 'completed' | 'cancelled';

export interface Service {
  id: string;
  name: string;
  category: string;
  durationMinutes: number;
  price: number;
  rating: number;
  description: string;
  accentColor: string;
}

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
