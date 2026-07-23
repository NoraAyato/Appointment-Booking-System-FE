import type {
  AdminPromotionDiscountType,
  AdminPromotionStatus,
} from '../types/admin-promotion-type';

export const ADMIN_PROMOTION_STATUS_OPTIONS: Array<{
  label: string;
  value: AdminPromotionStatus;
}> = [
  { label: 'Đang hoạt động', value: 'ACTIVE' },
  { label: 'Ngừng hoạt động', value: 'INACTIVE' },
  { label: 'Đã xóa', value: 'DELETED' },
];

export const ADMIN_PROMOTION_DISCOUNT_TYPE_OPTIONS: Array<{
  label: string;
  value: AdminPromotionDiscountType;
}> = [
  { label: 'Phần trăm', value: 'PERCENTAGE' },
  { label: 'Số tiền cố định', value: 'FIXED_AMOUNT' },
];

export const currencyFormatter = new Intl.NumberFormat('vi-VN', {
  currency: 'VND',
  style: 'currency',
});

export const getAdminPromotionStatusMeta = (status?: string) => {
  const normalizedStatus = status?.toUpperCase();

  if (normalizedStatus === 'ACTIVE') {
    return {
      color: 'green',
      label: 'Đang hoạt động',
    };
  }

  if (normalizedStatus === 'INACTIVE') {
    return {
      color: 'red',
      label: 'Ngừng hoạt động',
    };
  }

  if (normalizedStatus === 'DELETED') {
    return {
      color: 'default',
      label: 'Đã xóa',
    };
  }

  return {
    color: 'default',
    label: status || 'Chưa cập nhật',
  };
};

export const getAdminPromotionDiscountTypeLabel = (discountType?: string) => {
  if (discountType === 'PERCENTAGE') {
    return 'Phần trăm';
  }

  if (discountType === 'FIXED_AMOUNT') {
    return 'Số tiền cố định';
  }

  return discountType || 'Chưa cập nhật';
};

export const formatAdminPromotionDiscount = (amount: number, discountType: string) => {
  if (discountType === 'PERCENTAGE') {
    return `${amount}%`;
  }

  return currencyFormatter.format(amount);
};
