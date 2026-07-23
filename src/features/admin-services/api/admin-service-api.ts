import { axiosClient } from '@/shared/lib/axios';

import type {
  ApiMessageResponse,
  ApiResponse,
  PaginatedData,
} from '@/shared/types/api-type';
import type {
  AdminService,
  AdminServiceBasePayload,
  AdminServiceFilterParams,
  AdminServiceOption,
  CreateAdminServicePayload,
  PublicCategoryOption,
  UpdateAdminServicePayload,
} from '../types/admin-service-type';

const ADMIN_SERVICE_API_URL_PREFIX = '/admin/services';
const PUBLIC_CATEGORY_API_URL_PREFIX = '/public/categories';

const appendServiceBasePayload = (formData: FormData, payload: AdminServiceBasePayload) => {
  formData.append('name', payload.name);
  formData.append('description', payload.description);
  formData.append('durationMinutes', String(payload.durationMinutes));
  formData.append('price', String(payload.price));

  payload.images?.forEach((image) => {
    formData.append('images', image);
  });
};

const toCreateServiceFormData = (payload: CreateAdminServicePayload) => {
  const formData = new FormData();

  appendServiceBasePayload(formData, payload);
  formData.append('categoryId', payload.categoryId);

  return formData;
};

const toUpdateServiceFormData = (payload: UpdateAdminServicePayload) => {
  const formData = new FormData();

  appendServiceBasePayload(formData, payload);
  formData.append('status', payload.status);
  formData.append('categoryName', payload.categoryName);

  return formData;
};

export const adminServiceRoleAdminApi = {
  getAll: async ({ limit, page, keyword, status }: AdminServiceFilterParams) => {
    const response = await axiosClient.get<ApiResponse<PaginatedData<AdminService>>>(
      ADMIN_SERVICE_API_URL_PREFIX,
      {
        params: {
          keyword,
          page,
          size: limit,
          status,
        },
      },
    );

    return response.data;
  },

  create: async (payload: CreateAdminServicePayload) => {
    const response = await axiosClient.post<ApiMessageResponse>(
      ADMIN_SERVICE_API_URL_PREFIX,
      toCreateServiceFormData(payload),
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      },
    );

    return response.data;
  },

  update: async (id: string, payload: UpdateAdminServicePayload) => {
    const response = await axiosClient.put<ApiMessageResponse>(
      `${ADMIN_SERVICE_API_URL_PREFIX}/${id}`,
      toUpdateServiceFormData(payload),
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      },
    );

    return response.data;
  },

  getServiceOptions: async () => {
    const response = await axiosClient.get<ApiResponse<AdminServiceOption[]>>(
      `${ADMIN_SERVICE_API_URL_PREFIX}/service-options`,
    );

    return response.data;
  },
};

export const publicCategoryApi = {
  getOptions: async () => {
    const response = await axiosClient.get<ApiResponse<PublicCategoryOption[]>>(
      PUBLIC_CATEGORY_API_URL_PREFIX,
    );

    return response.data;
  },
};
