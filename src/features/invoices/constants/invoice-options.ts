import type { InvoicePaymentMethodOption } from '../types/invoice-type';

export const invoicePaymentMethodOptions: InvoicePaymentMethodOption[] = [
  {
    description: 'Thanh toán nhanh qua ví MoMo ở bước tiếp theo.',
    label: 'MoMo',
    value: 'MOMO',
  },
  {
    description: 'Phương thức này chưa được hỗ trợ trong phiên bản hiện tại.',
    disabled: true,
    label: 'Tiền mặt tại chỗ',
    value: 'CASH',
  },
];

export const invoiceStatusLabels: Record<string, string> = {
  CANCELLED: 'Đã hủy',
  PAID: 'Đã thanh toán',
  PENDING: 'Chờ thanh toán',
  UNPAID: 'Chưa thanh toán',
};

export const appointmentStatusLabels: Record<string, string> = {
  CANCELLED: 'Đã hủy',
  COMPLETED: 'Hoàn tất',
  CONFIRMED: 'Đã xác nhận',
  PENDING: 'Chờ xác nhận',
};
