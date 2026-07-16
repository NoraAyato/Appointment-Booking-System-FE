export type PromotionStatus = 'ACTIVE' | 'ENDING_SOON' | 'UPCOMING';

export interface PublicPromotionItem {
  id: string;
  code: string;
  description: string;
  discountLabel: string;
  startDate: string;
  endDate: string;
  image: string | null;
}

export interface PublicPromotionFilterParams {
  page: number;
  limit: number;
}

export interface PromotionCardModel {
  id: string;
  accentColor: string;
  code: string;
  description: string;
  discountLabel: string;
  endDate: string;
  imageUrl?: string;
  minSpend?: number;
  startDate: string;
  status: PromotionStatus;
  title: string;
}
