import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { unwrapApiResponse } from '@/shared/utils/api-response';

import { publicServiceApi } from '../api/public-service-api';
import { publicServiceQueryKeys } from '../constants/public-service-query-keys';
import type {
  PublicServiceCardModel,
  PublicServiceFilterParams,
} from '../types/public-service-type';

const PUBLIC_SERVICE_DETAIL_FALLBACK_LIMIT = 100;
const PUBLIC_SERVICE_STATIC_STALE_TIME = 5 * 60 * 1000;

export const usePublicServicesQuery = (params: PublicServiceFilterParams) =>
  useQuery({
    placeholderData: keepPreviousData,
    queryFn: async () => {
      const response = await publicServiceApi.getAll(params);

      return unwrapApiResponse(response, 'Không thể tải dịch vụ.');
    },
    queryKey: publicServiceQueryKeys.list(params),
  });

export const usePublicServiceCategoriesQuery = () =>
  useQuery({
    queryFn: async () => {
      const response = await publicServiceApi.getCategories();

      return unwrapApiResponse(response, 'Không thể tải danh mục.');
    },
    queryKey: publicServiceQueryKeys.categories(),
    staleTime: PUBLIC_SERVICE_STATIC_STALE_TIME,
  });

export const useTopRatedServicesQuery = () =>
  useQuery({
    queryFn: async () => {
      const response = await publicServiceApi.getTopRated();

      return unwrapApiResponse(response, 'Không thể tải dịch vụ nổi bật.');
    },
    queryKey: publicServiceQueryKeys.topRated(),
    staleTime: PUBLIC_SERVICE_STATIC_STALE_TIME,
  });

export const usePublicServiceDetailQuery = (
  serviceId?: string,
  initialService?: PublicServiceCardModel | null,
) =>
  useQuery({
    enabled: Boolean(serviceId),
    initialData: initialService ?? undefined,
    queryFn: async () => {
      const response = await publicServiceApi.getAll({
        limit: PUBLIC_SERVICE_DETAIL_FALLBACK_LIMIT,
        page: 1,
      });
      const services = unwrapApiResponse(response, 'Không thể tải thông tin dịch vụ.');

      return services.items.find((service) => service.id === serviceId) ?? null;
    },
    queryKey: publicServiceQueryKeys.detail(serviceId),
    staleTime: PUBLIC_SERVICE_STATIC_STALE_TIME,
  });
