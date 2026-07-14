import { CalendarOutlined } from '@ant-design/icons';
import { Card, Space, Table, Tag, Typography } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useEffect, useState } from 'react';

import { formatDateTime } from '@/shared/utils/date-format';

import { appointmentApi } from '../api/appointment-api';
import type { Appointment } from '../types/appointment-type';

const statusColor: Record<Appointment['status'], string> = {
  confirmed: 'green',
  pending: 'gold',
  completed: 'blue',
  cancelled: 'red',
};

const columns: ColumnsType<Appointment> = [
  {
    title: 'Mã lịch',
    dataIndex: 'id',
    key: 'id',
    render: (value) => <span className="font-semibold text-ink">{value}</span>,
  },
  {
    title: 'Dịch vụ',
    dataIndex: 'serviceName',
    key: 'serviceName',
  },
  {
    title: 'Chuyên viên',
    dataIndex: 'specialistName',
    key: 'specialistName',
  },
  {
    title: 'Thời gian',
    dataIndex: 'scheduledAt',
    key: 'scheduledAt',
    render: (value) => formatDateTime(value),
  },
  {
    title: 'Trạng thái',
    dataIndex: 'status',
    key: 'status',
    render: (value: Appointment['status']) => <Tag color={statusColor[value]}>{value}</Tag>,
  },
  {
    title: 'Chi phí',
    dataIndex: 'price',
    key: 'price',
    align: 'right',
    render: (value) => `${Number(value).toLocaleString('vi-VN')}đ`,
  },
];

export function AppointmentHistoryPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    appointmentApi.getBookingHistory().then((response) => {
      setAppointments(response.data);
      setLoading(false);
    });
  }, []);

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 md:px-8">
      <Space className="mb-6" align="center">
        <CalendarOutlined className="text-2xl text-sage" />
        <div>
          <Typography.Title level={2} className="!mb-0">
            Lịch sử đặt dịch vụ
          </Typography.Title>
          <Typography.Text className="text-slate-500">
            Theo dõi lịch sắp tới và các buổi đã hoàn thành.
          </Typography.Text>
        </div>
      </Space>

      <Card>
        <Table
          rowKey="id"
          loading={loading}
          dataSource={appointments}
          columns={columns}
          pagination={{ pageSize: 6 }}
          scroll={{ x: 860 }}
        />
      </Card>
    </main>
  );
}
