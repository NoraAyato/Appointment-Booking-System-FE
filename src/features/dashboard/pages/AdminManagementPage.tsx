import { Tag } from 'antd';
import { useMemo, useState } from 'react';

import { DataTable } from '@/shared/components/DataTable';

import { DashboardPage } from '../components/DashboardPage';

interface AdminManagementPageProps {
  title: string;
  description: string;
  sampleName: string;
}

const mockRows = [
  { id: 'item-01', name: 'Mẫu đang hoạt động', status: 'active', updatedAt: '2026-06-27' },
  { id: 'item-02', name: 'Mẫu cần kiểm tra', status: 'pending', updatedAt: '2026-06-26' },
  { id: 'item-03', name: 'Mẫu tạm khóa', status: 'inactive', updatedAt: '2026-06-25' },
  { id: 'item-04', name: 'Mẫu mới tạo', status: 'active', updatedAt: '2026-06-24' },
  { id: 'item-05', name: 'Mẫu đang nháp', status: 'pending', updatedAt: '2026-06-23' },
  { id: 'item-06', name: 'Mẫu đã ẩn', status: 'inactive', updatedAt: '2026-06-22' },
];

const statusColor: Record<string, string> = {
  active: 'green',
  pending: 'gold',
  inactive: 'red',
};

export function AdminManagementPage({ title, description, sampleName }: AdminManagementPageProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  const paginatedRows = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;

    return mockRows.slice(startIndex, startIndex + pageSize);
  }, [currentPage, pageSize]);

  const handlePageChange = (page: number, nextPageSize: number) => {
    setCurrentPage(page);
    setPageSize(nextPageSize);
  };

  return (
    <DashboardPage title={title} description={description}>
      <DataTable
        rowKey="id"
        dataSource={paginatedRows}
        title={sampleName}
        paginationConfig={{
          current: currentPage,
          onChange: handlePageChange,
          pageSize,
          total: mockRows.length,
        }}
        columns={[
          { title: 'Mã', dataIndex: 'id' },
          { title: 'Tên', dataIndex: 'name' },
          {
            title: 'Trạng thái',
            dataIndex: 'status',
            render: (status: string) => <Tag color={statusColor[status]}>{status}</Tag>,
          },
          { title: 'Cập nhật', dataIndex: 'updatedAt' },
        ]}
      />
    </DashboardPage>
  );
}