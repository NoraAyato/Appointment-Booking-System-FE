import { Card, Table } from 'antd';
import type { TableProps } from 'antd';
import type { ReactNode } from 'react';

import { toTablePagination } from '@/shared/utils/pagination';

import type { AppPaginationProps } from './AppPagination';

type DataTableBaseProps<RecordType extends object> = Omit<TableProps<RecordType>, 'title'>;

interface DataTableProps<RecordType extends object> extends DataTableBaseProps<RecordType> {
  cardClassName?: string;
  extra?: ReactNode;
  paginationConfig?: AppPaginationProps;
  title?: ReactNode;
}

export function DataTable<RecordType extends object>({
  cardClassName = 'mt-6',
  extra,
  pagination,
  paginationConfig,
  scroll = { x: 720 },
  title,
  ...tableProps
}: DataTableProps<RecordType>) {
  const tablePagination = paginationConfig ? toTablePagination(paginationConfig) : (pagination ?? false);

  return (
    <Card className={cardClassName} extra={extra} title={title}>
      <Table<RecordType> pagination={tablePagination} scroll={scroll} {...tableProps} />
    </Card>
  );
}