export type InvoicePaymentMethod = 'MOMO' | 'CASH';

export interface InvoiceCheckoutRouteState {
  invoiceId?: string;
}

export interface InvoicePaymentMethodOption {
  description: string;
  disabled?: boolean;
  label: string;
  value: InvoicePaymentMethod;
}

export interface ApplyPromotionPayload {
  promotionCode: string;
}

export interface ApplyPromotionResponse {
  promotionCode: string;
  discountValue: string;
}

export interface InvoiceDetail {
  appointmentStatus: string;
  bookingDate: string;
  categoryColorTag: string;
  categoryName: string;
  createdAt: string;
  duration: number;
  discountValue: string | null;
  endTime: string;
  invoiceId: string;
  invoiceStatus: string;
  note: string | null;
  serviceDescription: string;
  serviceImage: string | null;
  serviceName: string;
  promotionCode: string | null;
  staffImage: string | null;
  staffName: string;
  staffSpecializations: string[];
  startTime: string;
  totalPrice: string;
}
