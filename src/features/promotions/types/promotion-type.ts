export type PromotionStatus = 'ACTIVE' | 'ENDING_SOON' | 'UPCOMING';

export interface PromotionCardModel {
  id: string;
  accentColor: string;
  code: string;
  description: string;
  discountLabel: string;
  endDate: string;
  imageUrl: string;
  minSpend?: number;
  startDate: string;
  status: PromotionStatus;
  title: string;
}
