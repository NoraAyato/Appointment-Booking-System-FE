import dayjs from 'dayjs';

import { axiosClient } from '@/shared/lib/axios';
import type { ApiResponse, PaginatedData } from '@/shared/types/api-type';
import { getAssetUrl } from '@/shared/utils/asset-url';

import { PROMOTION_DEFAULT_ACCENT_COLOR } from '../constants/promotion-options';
import type {
  PromotionCardModel,
  PromotionStatus,
  PublicPromotionFilterParams,
  PublicPromotionItem,
} from '../types/promotion-type';

const PUBLIC_PROMOTION_API_URL_PREFIX = '/public/promotions';
const ENDING_SOON_THRESHOLD_DAYS = 7;

const getPromotionStatus = (promotion: PublicPromotionItem): PromotionStatus => {
  const today = dayjs().startOf('day');
  const startDate = dayjs(promotion.startDate).startOf('day');
  const endDate = dayjs(promotion.endDate).startOf('day');

  if (startDate.isValid() && startDate.isAfter(today)) {
    return 'UPCOMING';
  }

  if (endDate.isValid() && endDate.diff(today, 'day') <= ENDING_SOON_THRESHOLD_DAYS) {
    return 'ENDING_SOON';
  }

  return 'ACTIVE';
};

const toPromotionCardModel = (promotion: PublicPromotionItem): PromotionCardModel => ({
  accentColor: PROMOTION_DEFAULT_ACCENT_COLOR,
  code: promotion.code,
  description: promotion.description,
  discountLabel: promotion.discountLabel,
  endDate: promotion.endDate,
  id: promotion.id,
  imageUrl: getAssetUrl(promotion.image),
  startDate: promotion.startDate,
  status: getPromotionStatus(promotion),
  title: promotion.code,
});

const toPromotionListResponse = (
  response: ApiResponse<PaginatedData<PublicPromotionItem>>,
): ApiResponse<PaginatedData<PromotionCardModel>> => ({
  ...response,
  data: {
    ...response.data,
    items: response.data.items.map(toPromotionCardModel),
  },
});

export const promotionApi = {
  getPublicPromotions: async (params: PublicPromotionFilterParams) => {
    const response = await axiosClient.get<ApiResponse<PaginatedData<PublicPromotionItem>>>(
      PUBLIC_PROMOTION_API_URL_PREFIX,
      {
        params,
      },
    );

    return toPromotionListResponse(response.data);
  },
};
