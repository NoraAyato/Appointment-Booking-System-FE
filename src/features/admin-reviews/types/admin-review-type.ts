import type { FilterParams } from '@/shared/types/filter-params-type';

export type AdminReviewStatus = 'PENDING' | 'ENDING' | 'APPROVED' | 'DROPPED';

export interface AdminReview {
  id: string;
  picture: string;
  description: string;
  serviceScore: number;
  status: AdminReviewStatus | string;
  createAt: string;
  customerName: string;
}

export interface AdminReviewFilterParams extends FilterParams {
  keyWord?: string;
  status?: AdminReviewStatus;
}

export interface UpdateAdminReviewStatusPayload {
  status: AdminReviewStatus;
}
