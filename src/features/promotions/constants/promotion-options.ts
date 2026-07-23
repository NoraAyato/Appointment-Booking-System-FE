import type { PromotionCardModel } from '../types/promotion-type';

export const PROMOTION_PAGE_SIZE = 6;

export const PROMOTION_DEFAULT_ACCENT_COLOR = '#2F7D67';

export const promotionStatusLabels: Record<PromotionCardModel['status'], string> = {
  ACTIVE: 'Đang áp dụng',
  ENDING_SOON: 'Sắp kết thúc',
  UPCOMING: 'Sắp mở',
};
