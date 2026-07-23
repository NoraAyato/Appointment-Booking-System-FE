import type { UploadFile } from 'antd';
import type { Dayjs } from 'dayjs';

import type { FilterParams } from '@/shared/types/filter-params-type';

export type StaffAppointmentStatus = 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';

export interface StaffAppointment {
  appointmentDetailId: number;
  appointmentId: string;
  serviceId: string;
  serviceName: string;
  customerName: string;
  customerPhone: string;
  customerAvatar: string | null;
  startTime: string;
  endTime: string;
  quantity: number;
  status: StaffAppointmentStatus | string;
  note: string | null;
  picture: string | null;
}

export interface StaffAppointmentFilterParams extends FilterParams {
  date?: string;
  keyWord?: string;
  status?: StaffAppointmentStatus;
}

export interface StaffAppointmentFilterFormValues {
  date?: Dayjs;
  keyWord?: string;
  status?: StaffAppointmentStatus;
}

export interface CompleteStaffAppointmentPayload {
  picture: Blob;
}

export interface CompleteStaffAppointmentFormValues {
  picture?: UploadFile[];
}
