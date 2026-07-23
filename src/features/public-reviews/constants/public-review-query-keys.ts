import type { PublicServiceReviewFilterParams } from '../types/public-review-type';

export const publicReviewQueryKeys = {
  all: ['public-reviews'] as const,
  serviceReviews: (params: PublicServiceReviewFilterParams) =>
    [...publicReviewQueryKeys.all, 'service-reviews', params] as const,
  serviceStats: (serviceId?: string) =>
    [...publicReviewQueryKeys.all, 'service-stats', serviceId] as const,
  topRated: () => [...publicReviewQueryKeys.all, 'top-rated'] as const,
};
