import { axiosClient } from '@/shared/lib/axios';
import type { ApiMessageResponse, ApiResponse } from '@/shared/types/api-type';

import { toUser } from '../mappers/user-mapper';
import type { CurrentUserData, UpdateUserProfilePayload, User } from '../types/user-type';

export const userApi = {
  getMe: async () => {
    const response = await axiosClient.get<ApiResponse<CurrentUserData>>('/users/me');

    return {
      ...response.data,
      data: toUser(response.data.data),
    } satisfies ApiResponse<User>;
  },

  updateProfile: async (payload: UpdateUserProfilePayload) => {
    const response = await axiosClient.put<ApiMessageResponse>('/users/update-profile', payload);

    return response.data;
  },

  updateImage: async (image: File) => {
    const formData = new FormData();

    formData.append('file', image);

    const response = await axiosClient.put<ApiMessageResponse>('/users/update-image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  },
};
