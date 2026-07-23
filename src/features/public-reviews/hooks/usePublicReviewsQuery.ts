import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { unwrapApiResponse } from '@/shared/utils/api-response';

import { publicReviewApi } from '../api/public-review-api';
import { publicReviewQueryKeys } from '../constants/public-review-query-keys';
import type { PublicServiceReviewFilterParams } from '../types/public-review-type';

const PUBLIC_REVIEW_STATIC_STALE_TIME = 5 * 60 * 1000;

export const useTopRatedReviewsQuery = () =>
  useQuery({
    queryFn: async () => {
      const response = await publicReviewApi.getTopRated();

      return unwrapApiResponse(response, 'Không thể tải đánh giá nổi bật.');
    },
    queryKey: publicReviewQueryKeys.topRated(),
    staleTime: PUBLIC_REVIEW_STATIC_STALE_TIME,
  });

export const useServiceReviewStatsQuery = (serviceId?: string) =>
  useQuery({
    enabled: Boolean(serviceId),
    queryFn: async () => {
      const response = await publicReviewApi.getServiceStats(serviceId ?? '');

      return unwrapApiResponse(response, 'Không thể tải thống kê đánh giá.');
    },
    queryKey: publicReviewQueryKeys.serviceStats(serviceId),
    staleTime: PUBLIC_REVIEW_STATIC_STALE_TIME,
  });

export const useServiceReviewsQuery = (
  params: PublicServiceReviewFilterParams,
  enabled = Boolean(params.serviceId),
) =>
  useQuery({
    enabled,
    placeholderData: keepPreviousData,
    queryFn: async () => {
      const response = await publicReviewApi.getServiceReviews(params);

      return unwrapApiResponse(response, 'Không thể tải danh sách đánh giá.');
    },
    queryKey: publicReviewQueryKeys.serviceReviews(params),
  });
