import type { FilterParams } from '@/shared/types/filter-params-type';

export interface AdminCategory {
  id: string;
  name: string;
  description: string;
  totalService: number;
}

export interface AdminCategoryFilterParams extends FilterParams {
  keyword?: string;
}

export interface AdminCategoryPayload {
  name: string;
  description: string;
}
