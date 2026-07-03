import { isAxiosError } from 'axios';

import type { ApiResponse } from '@/shared/types/api-type';

const isApiErrorResponse = (value: unknown): value is Partial<ApiResponse<unknown>> =>
  typeof value === 'object' && value !== null && 'message' in value;

export function getApiErrorMessage(error: unknown, fallback: string) {
  if (isAxiosError(error) && isApiErrorResponse(error.response?.data)) {
    return error.response.data.message || fallback;
  }

  if (error instanceof Error) {
    return error.message || fallback;
  }

  return fallback;
}
