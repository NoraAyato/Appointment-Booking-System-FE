import { Pagination } from 'antd';
import type { PaginationProps } from 'antd';

export interface AppPaginationProps {
  align?: 'start' | 'center' | 'end';
  className?: string;
  current: number;
  disabled?: boolean;
  hideOnSinglePage?: boolean;
  onChange: (page: number, pageSize: number) => void;
  pageSize: number;
  pageSizeOptions?: PaginationProps['pageSizeOptions'];
  showQuickJumper?: boolean;
  showSizeChanger?: boolean;
  showTotal?: PaginationProps['showTotal'] | false;
  simple?: PaginationProps['simple'];
  size?: PaginationProps['size'];
  total: number;
}

const alignClassName: Record<NonNullable<AppPaginationProps['align']>, string> = {
  center: 'justify-center',
  end: 'justify-end',
  start: 'justify-start',
};

export function AppPagination({
  align = 'end',
  className,
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
}: AppPaginationProps) {
  const paginationShowTotal = showTotal === false ? undefined : showTotal;

  return (
    <div className={`flex ${alignClassName[align]} ${className ?? ''}`}>
      <Pagination
        current={current}
        disabled={disabled}
        hideOnSinglePage={hideOnSinglePage}
        onChange={onChange}
        pageSize={pageSize}
        pageSizeOptions={pageSizeOptions}
        showQuickJumper={showQuickJumper}
        showSizeChanger={showSizeChanger}
        showTotal={paginationShowTotal}
        simple={simple}
        size={size}
        total={total}
      />
    </div>
  );
}
