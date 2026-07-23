import { axiosClient } from '@/shared/lib/axios';
import type { ApiResponse, PaginatedData } from '@/shared/types/api-type';
import { getAssetUrl } from '@/shared/utils/asset-url';

import {
  DEFAULT_PUBLIC_SERVICE_CATEGORY_COLOR,
  DEFAULT_PUBLIC_SERVICE_LOCATION,
} from '../constants/public-service-options';
import type {
  PublicCategoryOption,
  PublicServiceAvailableTimeSlotFilterParams,
  PublicServiceAvailableTimeSlotItem,
  PublicServiceCardModel,
  PublicServiceFilterParams,
  PublicServiceItem,
  PublicServiceStaffFilterParams,
  PublicServiceStaffItem,
  PublicServiceStaffModel,
} from '../types/public-service-type';

const PUBLIC_SERVICE_API_URL_PREFIX = '/public/services';
const PUBLIC_CATEGORY_API_URL_PREFIX = '/public/categories';

const toPublicServiceImageUrls = (images: PublicServiceItem['images']) =>
  images
    ?.map((image) => getAssetUrl(image))
    .filter((imageUrl): imageUrl is string => Boolean(imageUrl)) ?? [];

const toPublicServiceCardModel = (service: PublicServiceItem): PublicServiceCardModel => {
  const imageUrls = toPublicServiceImageUrls(service.images);

  return {
    accentColor: service.categoryTagColor || DEFAULT_PUBLIC_SERVICE_CATEGORY_COLOR,
    category: service.category,
    description: service.description,
    durationMinutes: service.durationMinutes,
    id: service.id,
    imageUrl: imageUrls[0],
    imageUrls,
    location: DEFAULT_PUBLIC_SERVICE_LOCATION,
    name: service.name,
    price: service.price,
    rating: service.rating,
  };
};

const toPublicServiceStaffModel = (staff: PublicServiceStaffItem): PublicServiceStaffModel => ({
  avatarUrl: getAssetUrl(staff.staffAvatar),
  completedServices: staff.completedServices,
  id: staff.id,
  name: staff.staffName,
  rating: staff.rating,
  specialties: staff.specialties,
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

const toPublicServiceStaffResponse = (
  response: ApiResponse<PublicServiceStaffItem[]>,
): ApiResponse<PublicServiceStaffModel[]> => ({
  ...response,
  data: response.data.map(toPublicServiceStaffModel),
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

  getAvailableStaff: async ({ date, serviceId, time }: PublicServiceStaffFilterParams) => {
    const response = await axiosClient.get<ApiResponse<PublicServiceStaffItem[]>>(
      `${PUBLIC_SERVICE_API_URL_PREFIX}/${serviceId}/staff`,
      {
        params: {
          date,
          time,
        },
      },
    );

    return toPublicServiceStaffResponse(response.data);
  },

  getAvailableTimeSlots: async ({ date, serviceId }: PublicServiceAvailableTimeSlotFilterParams) => {
    const response = await axiosClient.get<ApiResponse<PublicServiceAvailableTimeSlotItem[]>>(
      `${PUBLIC_SERVICE_API_URL_PREFIX}/${serviceId}/available-time-slots`,
      {
        params: {
          date,
        },
      },
    );

    return response.data;
  },
};
