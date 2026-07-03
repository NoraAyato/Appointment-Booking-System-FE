import type { UploadFile } from 'antd';
import type { Dayjs } from 'dayjs';

import type { FilterParams } from '@/shared/types/filter-params-type';

export type AdminPromotionStatus = 'ACTIVE' | 'INACTIVE' | 'DELETED';
export type AdminPromotionDiscountType = 'PERCENTAGE' | 'FIXED_AMOUNT';

export interface AdminPromotion {
  id: string;
  promotionCode: string;
  description: string;
  discountAmount: number;
  discountType: string;
  status: string;
  image: string;
  startDate: string;
  endDate: string;
}

export interface AdminPromotionFilterParams extends FilterParams {
  discountType?: AdminPromotionDiscountType;
  fromDate?: string;
  keyword?: string;
  status?: AdminPromotionStatus;
  toDate?: string;
}

export interface AdminPromotionBasePayload {
  description: string;
  discountAmount: number;
  discountType: AdminPromotionDiscountType;
  endDate: string;
  image?: Blob;
  promotionCode: string;
  startDate: string;
}

export type CreateAdminPromotionPayload = AdminPromotionBasePayload;

export interface UpdateAdminPromotionPayload extends AdminPromotionBasePayload {
  status: AdminPromotionStatus;
}

export interface AdminPromotionFormValues {
  description: string;
  discountAmount: number;
  discountType: AdminPromotionDiscountType;
  endDate: Dayjs;
  image?: UploadFile[];
  promotionCode: string;
  startDate: Dayjs;
  status?: AdminPromotionStatus;
}

export interface AdminPromotionFilterFormValues {
  dateRange?: [Dayjs, Dayjs];
  discountType?: AdminPromotionDiscountType;
  keyword?: string;
  status?: AdminPromotionStatus;
}
