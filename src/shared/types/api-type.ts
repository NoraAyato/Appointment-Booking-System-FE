export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface ApiMessageResponse {
  success: boolean;
  message: string;
  data?: unknown;
}

export interface PaginatedData<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
}
