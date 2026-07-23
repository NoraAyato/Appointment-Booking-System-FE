import type { TablePaginationConfig } from 'antd';

import type { AppPaginationProps } from '@/shared/components/AppPagination';

export function toTablePagination({
  current,
  disabled,
  hideOnSinglePage = false,
  onChange,
  pageSize,
  pageSizeOptions = [5, 10, 20, 50],
  showQuickJumper = false,
  showSizeChanger = true,
  showTotal = (total, range) => `${range[0]}-${range[1]} / ${total}`,
  simple,
  size,
  total,
}: AppPaginationProps): TablePaginationConfig {
  const tableShowTotal = showTotal === false ? undefined : showTotal;

  return {
    current,
    disabled,
    hideOnSinglePage,
    onChange,
    pageSize,
    pageSizeOptions,
    showQuickJumper,
    showSizeChanger,
    showTotal: tableShowTotal,
    simple,
    size,
    total,
  };
}
