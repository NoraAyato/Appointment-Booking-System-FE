import { PlusOutlined, ReloadOutlined, SearchOutlined } from '@ant-design/icons';
import { Button, Card, DatePicker, Form, Input, Modal, Space, Tag, TimePicker, notification } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import type { Dayjs } from 'dayjs';
import { useEffect, useRef, useState } from 'react';

import { DashboardPage } from '@/features/dashboard/components/DashboardPage';
import { AppSelect } from '@/shared/components/AppSelect';
import { DataTable } from '@/shared/components/DataTable';
import { useTable } from '@/shared/hooks/useTable';
import { getApiErrorMessage } from '@/shared/utils/api-error';
import { formatDate, formatTimeRange } from '@/shared/utils/date-format';

import { staffShiftRoleStaffApi } from '../api/staff-shift-api';
import {
  STAFF_SHIFT_STATUS_OPTIONS,
  getStaffShiftStatusMeta,
} from '../constants/staff-shift-options';
import type {
  CreateStaffShiftPayload,
  StaffShift,
  StaffShiftFilterParams,
  StaffShiftFormValues,
} from '../types/staff-shift-type';

type ShiftFilterFormValues = Pick<StaffShiftFilterParams, 'keyWord' | 'status'>;

const toDefaultTimeValue = (value: string) => dayjs(`2026-01-01T${value}`);

const toCreatePayload = (values: StaffShiftFormValues): CreateStaffShiftPayload => ({
  endTime: values.endTime.format('HH:mm:ss'),
  startTime: values.startTime.format('HH:mm:ss'),
  workDate: values.workDate.format('YYYY-MM-DD'),
});

export function StaffShiftsPage() {
  const [filterForm] = Form.useForm<ShiftFilterFormValues>();
  const [shiftForm] = Form.useForm<StaffShiftFormValues>();
  const [toast, toastContextHolder] = notification.useNotification();
  const [modalOpen, setModalOpen] = useState(false);
  const [mutationLoading, setMutationLoading] = useState(false);
  const lastListErrorRef = useRef<string | null>(null);

  const {
    currentPage,
    error,
    filters,
    handleFilterChange,
    handlePageChange,
    items,
    loading,
    pageSize,
    refetch,
    resetFilters,
    total,
  } = useTable<StaffShift, StaffShiftFilterParams>({
    fetchData: staffShiftRoleStaffApi.getAll,
    initialPageSize: 10,
  });

  useEffect(() => {
    if (!error || lastListErrorRef.current === error) {
      return;
    }

    lastListErrorRef.current = error;
    toast.error({
      message: 'Không thể tải danh sách ca làm',
      description: error,
      placement: 'topRight',
    });
  }, [error, toast]);

  const openCreateModal = () => {
    shiftForm.resetFields();
    shiftForm.setFieldsValue({
      endTime: toDefaultTimeValue('17:00:00'),
      startTime: toDefaultTimeValue('08:00:00'),
      workDate: dayjs(),
    });
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    shiftForm.resetFields();
  };

  const handleCreateShift = async (values: StaffShiftFormValues) => {
    setMutationLoading(true);

    try {
      const response = await staffShiftRoleStaffApi.create(toCreatePayload(values));

      if (!response.success) {
        throw new Error(response.message || 'Không thể tạo ca làm.');
      }

      toast.success({
        message: 'Tạo ca làm thành công',
        description: response.message,
        placement: 'topRight',
      });
      closeModal();
      await refetch();
    } catch (error) {
      toast.error({
        message: 'Tạo ca làm thất bại',
        description: getApiErrorMessage(error, 'Vui lòng thử lại sau.'),
        placement: 'topRight',
      });
    } finally {
      setMutationLoading(false);
    }
  };

  const handleSearch = (values: ShiftFilterFormValues) => {
    handleFilterChange({
      keyWord: values.keyWord?.trim() || undefined,
      status: values.status,
    });
  };

  const handleReset = () => {
    filterForm.resetFields();
    resetFilters();
  };

  const columns: ColumnsType<StaffShift> = [
    {
      title: 'Ngày làm',
      dataIndex: 'workDate',
      width: 130,
      render: (value: string) => formatDate(value),
    },
    {
      title: 'Khung giờ',
      key: 'timeRange',
      width: 140,
      render: (_, record) => formatTimeRange(record.startTime, record.endTime),
    },
    {
      title: 'Dịch vụ phụ trách',
      dataIndex: 'serviceNames',
      render: (serviceNames: string[]) =>
        serviceNames?.length ? (
          <Space wrap>
            {serviceNames.map((serviceName) => (
              <Tag key={serviceName} color="blue">
                {serviceName}
              </Tag>
            ))}
          </Space>
        ) : (
          'Chưa phân công'
        ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      width: 130,
      render: (status: string) => {
        const statusMeta = getStaffShiftStatusMeta(status);

        return <Tag color={statusMeta.color}>{statusMeta.label}</Tag>;
      },
    },
  ];

  return (
    <>
      {toastContextHolder}

      <DashboardPage
        title="Ca làm việc của tôi"
        description="Theo dõi ca làm được duyệt, dịch vụ đang phụ trách và gửi yêu cầu tạo ca mới."
        actions={
          <Space wrap>
            <Button icon={<ReloadOutlined />} loading={loading} onClick={() => void refetch()}>
              Tải lại
            </Button>
            <Button type="primary" icon={<PlusOutlined />} onClick={openCreateModal}>
              Tạo ca làm
            </Button>
          </Space>
        }
      >
        <Card className="staff-dashboard-filter-card">
          <Form<ShiftFilterFormValues>
            form={filterForm}
            initialValues={filters}
            layout="vertical"
            onFinish={handleSearch}
          >
            <div className="staff-dashboard-filter-grid">
              <Form.Item name="keyWord" label="Tìm kiếm" className="!mb-0">
                <Input
                  allowClear
                  placeholder="Dịch vụ hoặc thông tin liên quan"
                  prefix={<SearchOutlined />}
                />
              </Form.Item>
              <Form.Item name="status" label="Trạng thái" className="!mb-0">
                <AppSelect
                  allowClear
                  options={STAFF_SHIFT_STATUS_OPTIONS}
                  placeholder="Tất cả trạng thái"
                />
              </Form.Item>
              <Space className="justify-end">
                <Button onClick={handleReset}>Đặt lại</Button>
                <Button type="primary" htmlType="submit" icon={<SearchOutlined />}>
                  Tìm
                </Button>
              </Space>
            </div>
          </Form>
        </Card>

        <DataTable<StaffShift>
          rowKey="id"
          dataSource={items}
          loading={loading}
          title="Danh sách ca làm"
          columns={columns}
          locale={{ emptyText: 'Chưa có ca làm nào.' }}
          paginationConfig={{
            current: currentPage,
            onChange: handlePageChange,
            pageSize,
            total,
          }}
        />
      </DashboardPage>

      <Modal
        open={modalOpen}
        title="Tạo ca làm"
        okText="Tạo ca"
        cancelText="Hủy"
        confirmLoading={mutationLoading}
        onCancel={closeModal}
        onOk={() => void shiftForm.submit()}
      >
        <Form<StaffShiftFormValues> form={shiftForm} layout="vertical" onFinish={handleCreateShift}>
          <Form.Item
            name="workDate"
            label="Ngày làm"
            rules={[{ required: true, message: 'Vui lòng chọn ngày làm.' }]}
          >
            <DatePicker className="w-full" format="DD/MM/YYYY" />
          </Form.Item>
          <div className="grid gap-3 md:grid-cols-2">
            <Form.Item
              name="startTime"
              label="Giờ bắt đầu"
              rules={[{ required: true, message: 'Vui lòng chọn giờ bắt đầu.' }]}
            >
              <TimePicker className="w-full" format="HH:mm" minuteStep={5} />
            </Form.Item>
            <Form.Item
              name="endTime"
              label="Giờ kết thúc"
              dependencies={['startTime']}
              rules={[
                { required: true, message: 'Vui lòng chọn giờ kết thúc.' },
                ({ getFieldValue }) => ({
                  validator(_, value?: Dayjs) {
                    const startTime = getFieldValue('startTime') as Dayjs | undefined;

                    if (!value || !startTime || value.isAfter(startTime)) {
                      return Promise.resolve();
                    }

                    return Promise.reject(new Error('Giờ kết thúc phải sau giờ bắt đầu.'));
                  },
                }),
              ]}
            >
              <TimePicker className="w-full" format="HH:mm" minuteStep={5} />
            </Form.Item>
          </div>
        </Form>
      </Modal>
    </>
  );
}
