import { axiosClient } from '@/shared/lib/axios';
import type { ApiResponse, PaginatedData } from '@/shared/types/api-type';
import { getAssetUrl } from '@/shared/utils/asset-url';

import type {
  PublicServiceReviewFilterParams,
  PublicServiceReviewItem,
  PublicServiceReviewModel,
  PublicServiceReviewStats,
  PublicTopRatedReviewItem,
  PublicTopRatedReviewModel,
} from '../types/public-review-type';

const API_URL_PREFIX = '/public/reviews';

const toTopRatedReviewModel = (
  review: PublicTopRatedReviewItem,
): PublicTopRatedReviewModel => ({
  avatarUrl: getAssetUrl(review.customerAvatar),
  content: review.content,
  customerName: review.customerName,
  id: review.id,
  imageUrl: getAssetUrl(review.imageUrl),
  rating: review.rating,
  serviceDate: review.serviceDate,
  serviceName: review.serviceName,
});

const toServiceReviewModel = (review: PublicServiceReviewItem): PublicServiceReviewModel => {
  const imageUrl = getAssetUrl(review.imageUrl);

  return {
    avatarUrl: getAssetUrl(review.customerAvatar),
    content: review.content,
    createdAt: review.createdAt,
    customerName: review.customerName,
    id: review.id,
    imageUrls: imageUrl ? [imageUrl] : [],
    rating: review.rating,
    serviceDate: review.serviceDate,
    staffName: review.staffName,
  };
};

const toServiceReviewListResponse = (
  response: ApiResponse<PaginatedData<PublicServiceReviewItem>>,
): ApiResponse<PaginatedData<PublicServiceReviewModel>> => ({
  ...response,
  data: {
    ...response.data,
    items: response.data.items.map(toServiceReviewModel),
  },
});

export const publicReviewApi = {
  getTopRated: async () => {
    const response = await axiosClient.get<ApiResponse<PublicTopRatedReviewItem[]>>(
      `${API_URL_PREFIX}/top-rated`,
    );

    return {
      ...response.data,
      data: response.data.data.map(toTopRatedReviewModel).slice(0, 3),
    };
  },

  getServiceStats: async (serviceId: string) => {
    const response = await axiosClient.get<ApiResponse<PublicServiceReviewStats>>(
      `${API_URL_PREFIX}/services/${serviceId}/stats`,
    );

    return response.data;
  },

  getServiceReviews: async ({ limit, page, serviceId }: PublicServiceReviewFilterParams) => {
    const response = await axiosClient.get<ApiResponse<PaginatedData<PublicServiceReviewItem>>>(
      `${API_URL_PREFIX}/services/${serviceId}`,
      {
        params: {
          limit,
          page,
        },
      },
    );

    return toServiceReviewListResponse(response.data);
  },
};
