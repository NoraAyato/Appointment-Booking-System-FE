import { axiosClient } from '@/shared/lib/axios';
import type { ApiResponse } from '@/shared/types/api-type';

import { toUser } from '../mappers/user-mapper';
import type { CurrentUserData, User } from '../types/user-type';

export const userApi = {
  getMe: async () => {
    const response = await axiosClient.get<ApiResponse<CurrentUserData>>('/users/me');

    return {
      ...response.data,
      data: toUser(response.data.data),
    } satisfies ApiResponse<User>;
  },
};
