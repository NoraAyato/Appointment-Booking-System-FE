import type { ApiResponse } from '@/shared/types/api-type';

export const unwrapApiResponse = <T>(response: ApiResponse<T>, fallbackMessage: string) => {
  if (!response.success) {
    throw new Error(response.message || fallbackMessage);
  }

  return response.data;
};
