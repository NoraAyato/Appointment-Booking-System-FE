import { useCallback, useEffect, useMemo, useState } from 'react';

import type { ApiResponse, PaginatedData } from '@/shared/types/api-type';
import type { FilterParams } from '@/shared/types/filter-params-type';
import { getApiErrorMessage } from '@/shared/utils/api-error';

interface UseTableOptions<TItem, TParams extends FilterParams> {
  fetchData: (params: TParams) => Promise<ApiResponse<PaginatedData<TItem>>>;
  initialFilters?: Omit<TParams, 'page' | 'limit'>;
  initialPage?: number;
  initialPageSize?: number;
}

export function useTable<TItem, TParams extends FilterParams>({
  fetchData,
  initialFilters,
  initialPage = 1,
  initialPageSize = 10,
}: UseTableOptions<TItem, TParams>) {
  const defaultFilters = useMemo(
    () => initialFilters ?? ({} as Omit<TParams, 'page' | 'limit'>),
    [initialFilters],
  );
  const [items, setItems] = useState<TItem[]>([]);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [filters, setFilters] = useState<Omit<TParams, 'page' | 'limit'>>(defaultFilters);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const params = useMemo(
    () =>
      ({
        ...filters,
        page: currentPage,
        limit: pageSize,
      }) as TParams,
    [currentPage, filters, pageSize],
  );

  const fetchTableData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetchData(params);

      if (!response.success) {
        throw new Error(response.message || 'Không thể tải dữ liệu.');
      }

      setItems(response.data.items);
      setTotal(response.data.total);
      setCurrentPage(response.data.page || currentPage);
      setPageSize(response.data.limit || pageSize);
    } catch (fetchError) {
      setItems([]);
      setTotal(0);
      setError(getApiErrorMessage(fetchError, 'Không thể tải dữ liệu.'));
    } finally {
      setLoading(false);
    }
  }, [currentPage, fetchData, pageSize, params]);

  useEffect(() => {
    void fetchTableData();
  }, [fetchTableData]);

  const handlePageChange = (page: number, nextPageSize: number) => {
    setCurrentPage(page);
    setPageSize(nextPageSize);
  };

  const handleFilterChange = (nextFilters: Omit<TParams, 'page' | 'limit'>) => {
    setFilters(nextFilters);
    setCurrentPage(1);
  };

  const resetFilters = () => {
    setFilters(defaultFilters);
    setCurrentPage(1);
  };

  return {
    currentPage,
    error,
    filters,
    handleFilterChange,
    handlePageChange,
    items,
    loading,
    pageSize,
    refetch: fetchTableData,
    resetFilters,
    total,
  };
}
