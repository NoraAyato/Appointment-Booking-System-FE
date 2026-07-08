import { axiosClient } from '@/shared/lib/axios';
import type { ApiResponse, PaginatedData } from '@/shared/types/api-type';
import { getAssetUrl } from '@/shared/utils/asset-url';

import {
  DEFAULT_PUBLIC_SERVICE_CATEGORY_COLOR,
  DEFAULT_PUBLIC_SERVICE_LOCATION,
} from '../constants/public-service-options';
import type {
  PublicCategoryOption,
  PublicServiceCardModel,
  PublicServiceFilterParams,
  PublicServiceItem,
} from '../types/public-service-type';

const PUBLIC_SERVICE_API_URL_PREFIX = '/public/services';
const PUBLIC_CATEGORY_API_URL_PREFIX = '/public/categories';

const toPublicServiceCardModel = (service: PublicServiceItem): PublicServiceCardModel => ({
  accentColor: service.categoryTagColor || DEFAULT_PUBLIC_SERVICE_CATEGORY_COLOR,
  category: service.category,
  description: service.description,
  durationMinutes: service.durationMinutes,
  id: service.id,
  imageUrl: getAssetUrl(service.images?.[0]),
  location: DEFAULT_PUBLIC_SERVICE_LOCATION,
  name: service.name,
  price: service.price,
  rating: service.rating,
});

const toPublicServiceListResponse = (
  response: ApiResponse<PaginatedData<PublicServiceItem>>,
): ApiResponse<PaginatedData<PublicServiceCardModel>> => ({
  ...response,
  data: {
    ...response.data,
    items: response.data.items.map(toPublicServiceCardModel),
  },
});

export const publicServiceApi = {
  getAll: async (params: PublicServiceFilterParams) => {
    const response = await axiosClient.get<ApiResponse<PaginatedData<PublicServiceItem>>>(
      PUBLIC_SERVICE_API_URL_PREFIX,
      {
        params,
      },
    );

    return toPublicServiceListResponse(response.data);
  },

  getTopRated: async () => {
    const response = await axiosClient.get<ApiResponse<PublicServiceItem[]>>(
      `${PUBLIC_SERVICE_API_URL_PREFIX}/top-rated`,
    );

    return {
      ...response.data,
      data: response.data.data.map(toPublicServiceCardModel),
    };
  },

  getCategories: async () => {
    const response = await axiosClient.get<ApiResponse<PublicCategoryOption[]>>(
      PUBLIC_CATEGORY_API_URL_PREFIX,
    );

    return response.data;
  },
};
