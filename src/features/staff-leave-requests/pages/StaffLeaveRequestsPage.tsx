import { PlusOutlined, ReloadOutlined, SearchOutlined } from '@ant-design/icons';
import {
  Button,
  Card,
  DatePicker,
  Form,
  Input,
  Modal,
  Space,
  Switch,
  Tag,
  TimePicker,
  Typography,
  notification,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import type { Dayjs } from 'dayjs';
import { useEffect, useRef, useState } from 'react';

import { DashboardPage } from '@/features/dashboard/components/DashboardPage';
import { AppSelect } from '@/shared/components/AppSelect';
import { DataTable } from '@/shared/components/DataTable';
import { useTable } from '@/shared/hooks/useTable';
import { getApiErrorMessage } from '@/shared/utils/api-error';
import {
  formatDate as formatDisplayDate,
  formatTimeRange as formatDisplayTimeRange,
} from '@/shared/utils/date-format';

import { staffLeaveRequestRoleStaffApi } from '../api/staff-leave-request-api';
import {
  STAFF_LEAVE_REQUEST_STATUS_OPTIONS,
  getStaffLeaveRequestStatusMeta,
} from '../constants/staff-leave-request-options';
import type {
  CreateStaffLeaveRequestPayload,
  StaffLeaveRequest,
  StaffLeaveRequestFilterParams,
  StaffLeaveRequestFormValues,
} from '../types/staff-leave-request-type';

type LeaveRequestFilterFormValues = Pick<StaffLeaveRequestFilterParams, 'keyWord' | 'status'>;

const toCreatePayload = (
  values: StaffLeaveRequestFormValues,
): CreateStaffLeaveRequestPayload => ({
  blockedDate: values.isEveryDay ? null : (values.blockedDate?.format('YYYY-MM-DD') ?? null),
  endTime: values.isAllDay ? null : (values.endTime?.format('HH:mm:ss') ?? null),
  reason: values.reason.trim(),
  startTime: values.isAllDay ? null : (values.startTime?.format('HH:mm:ss') ?? null),
});

export function StaffLeaveRequestsPage() {
  const [filterForm] = Form.useForm<LeaveRequestFilterFormValues>();
  const [leaveRequestForm] = Form.useForm<StaffLeaveRequestFormValues>();
  const [toast, toastContextHolder] = notification.useNotification();
  const [modalOpen, setModalOpen] = useState(false);
  const [mutationLoading, setMutationLoading] = useState(false);
  const lastListErrorRef = useRef<string | null>(null);
  const isEveryDay = Form.useWatch('isEveryDay', leaveRequestForm);
  const isAllDay = Form.useWatch('isAllDay', leaveRequestForm);

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
  } = useTable<StaffLeaveRequest, StaffLeaveRequestFilterParams>({
    fetchData: staffLeaveRequestRoleStaffApi.getAll,
    initialPageSize: 10,
  });

  useEffect(() => {
    if (!error || lastListErrorRef.current === error) {
      return;
    }

    lastListErrorRef.current = error;
    toast.error({
      message: 'Không thể tải danh sách xin nghỉ',
      description: error,
      placement: 'topRight',
    });
  }, [error, toast]);

  const openCreateModal = () => {
    leaveRequestForm.resetFields();
    leaveRequestForm.setFieldsValue({
      blockedDate: dayjs(),
      isAllDay: false,
      isEveryDay: false,
    });
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    leaveRequestForm.resetFields();
  };

  const handleEveryDayChange = (checked: boolean) => {
    if (checked) {
      leaveRequestForm.setFieldValue('blockedDate', null);
    }
  };

  const handleAllDayChange = (checked: boolean) => {
    if (!checked) {
      return;
    }

    leaveRequestForm.setFieldsValue({
      endTime: null,
      isEveryDay: false,
      startTime: null,
    });
  };

  const handleCreateLeaveRequest = async (values: StaffLeaveRequestFormValues) => {
    setMutationLoading(true);

    try {
      const response = await staffLeaveRequestRoleStaffApi.create(toCreatePayload(values));

      if (!response.success) {
        throw new Error(response.message || 'Không thể gửi yêu cầu xin nghỉ.');
      }

      toast.success({
        message: 'Gửi yêu cầu xin nghỉ thành công',
        description: response.message,
        placement: 'topRight',
      });
      closeModal();
      await refetch();
    } catch (error) {
      toast.error({
        message: 'Gửi yêu cầu xin nghỉ thất bại',
        description: getApiErrorMessage(error, 'Vui lòng thử lại sau.'),
        placement: 'topRight',
      });
    } finally {
      setMutationLoading(false);
    }
  };

  const handleSearch = (values: LeaveRequestFilterFormValues) => {
    handleFilterChange({
      keyWord: values.keyWord?.trim() || undefined,
      status: values.status,
    });
  };

  const handleReset = () => {
    filterForm.resetFields();
    resetFilters();
  };

  const columns: ColumnsType<StaffLeaveRequest> = [
    {
      title: 'Lý do',
      dataIndex: 'reason',
      ellipsis: true,
    },
    {
      title: 'Ngày nghỉ',
      dataIndex: 'blockedDate',
      width: 130,
      render: (value?: string | null) => formatDisplayDate(value, 'Mọi ngày'),
    },
    {
      title: 'Khung giờ',
      key: 'timeRange',
      width: 140,
      render: (_, record) => formatDisplayTimeRange(record.startTime, record.endTime, 'Cả ngày'),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      width: 130,
      render: (status: string) => {
        const statusMeta = getStaffLeaveRequestStatusMeta(status);

        return <Tag color={statusMeta.color}>{statusMeta.label}</Tag>;
      },
    },
  ];

  return (
    <>
      {toastContextHolder}

      <DashboardPage
        title="Xin nghỉ"
        description="Gửi yêu cầu nghỉ hoặc chặn thời gian cá nhân, theo dõi trạng thái duyệt từ quản trị."
        actions={
          <Space wrap>
            <Button icon={<ReloadOutlined />} loading={loading} onClick={() => void refetch()}>
              Tải lại
            </Button>
            <Button type="primary" icon={<PlusOutlined />} onClick={openCreateModal}>
              Gửi yêu cầu
            </Button>
          </Space>
        }
      >
        <Card className="staff-dashboard-filter-card">
          <Form<LeaveRequestFilterFormValues>
            form={filterForm}
            initialValues={filters}
            layout="vertical"
            onFinish={handleSearch}
          >
            <div className="staff-dashboard-filter-grid">
              <Form.Item name="keyWord" label="Tìm kiếm" className="!mb-0">
                <Input allowClear placeholder="Lý do xin nghỉ" prefix={<SearchOutlined />} />
              </Form.Item>
              <Form.Item name="status" label="Trạng thái" className="!mb-0">
                <AppSelect
                  allowClear
                  options={STAFF_LEAVE_REQUEST_STATUS_OPTIONS}
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

        <DataTable<StaffLeaveRequest>
          rowKey="id"
          dataSource={items}
          loading={loading}
          title="Danh sách yêu cầu xin nghỉ"
          columns={columns}
          locale={{ emptyText: 'Chưa có yêu cầu xin nghỉ nào.' }}
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
        title="Gửi yêu cầu xin nghỉ"
        okText="Gửi yêu cầu"
        cancelText="Hủy"
        confirmLoading={mutationLoading}
        onCancel={closeModal}
        onOk={() => void leaveRequestForm.submit()}
      >
        <Form<StaffLeaveRequestFormValues>
          form={leaveRequestForm}
          layout="vertical"
          onFinish={handleCreateLeaveRequest}
        >
          <Form.Item
            name="reason"
            label="Lý do"
            rules={[{ required: true, message: 'Vui lòng nhập lý do xin nghỉ.' }]}
          >
            <Input.TextArea rows={3} placeholder="Nhập lý do xin nghỉ" />
          </Form.Item>
          <div className="grid gap-3 md:grid-cols-2">
            <Form.Item
              name="isEveryDay"
              label="Áp dụng mọi ngày"
              valuePropName="checked"
              className="!mb-0"
            >
              <Switch
                checkedChildren="Mọi ngày"
                disabled={Boolean(isAllDay)}
                unCheckedChildren="Theo ngày"
                onChange={handleEveryDayChange}
              />
            </Form.Item>
            <Form.Item
              name="isAllDay"
              label="Nghỉ cả ngày"
              valuePropName="checked"
              className="!mb-0"
            >
              <Switch
                checkedChildren="Cả ngày"
                unCheckedChildren="Theo giờ"
                onChange={handleAllDayChange}
              />
            </Form.Item>
          </div>
          <Form.Item
            name="blockedDate"
            label="Ngày nghỉ"
            dependencies={['isEveryDay', 'isAllDay']}
            rules={[
              ({ getFieldValue }) => ({
                validator(_, value?: Dayjs | null) {
                  if (getFieldValue('isEveryDay') || value) {
                    return Promise.resolve();
                  }

                  return Promise.reject(
                    new Error('Vui lòng chọn ngày nghỉ hoặc bật áp dụng mọi ngày.'),
                  );
                },
              }),
            ]}
          >
            <DatePicker className="w-full" disabled={Boolean(isEveryDay)} format="DD/MM/YYYY" />
          </Form.Item>
          <div className="grid gap-3 md:grid-cols-2">
            <Form.Item
              name="startTime"
              label="Giờ bắt đầu"
              dependencies={['isAllDay']}
              rules={[
                ({ getFieldValue }) => ({
                  validator(_, value?: Dayjs | null) {
                    if (getFieldValue('isAllDay') || value) {
                      return Promise.resolve();
                    }

                    return Promise.reject(new Error('Vui lòng chọn giờ bắt đầu.'));
                  },
                }),
              ]}
            >
              <TimePicker className="w-full" disabled={Boolean(isAllDay)} format="HH:mm" minuteStep={5} />
            </Form.Item>
            <Form.Item
              name="endTime"
              label="Giờ kết thúc"
              dependencies={['startTime', 'isAllDay']}
              rules={[
                ({ getFieldValue }) => ({
                  validator(_, value?: Dayjs | null) {
                    if (getFieldValue('isAllDay')) {
                      return Promise.resolve();
                    }

                    if (!value) {
                      return Promise.reject(new Error('Vui lòng chọn giờ kết thúc.'));
                    }

                    const startTime = getFieldValue('startTime') as Dayjs | undefined;

                    if (!startTime || value.isAfter(startTime)) {
                      return Promise.resolve();
                    }

                    return Promise.reject(new Error('Giờ kết thúc phải sau giờ bắt đầu.'));
                  },
                }),
              ]}
            >
              <TimePicker className="w-full" disabled={Boolean(isAllDay)} format="HH:mm" minuteStep={5} />
            </Form.Item>
          </div>
          {isAllDay ? (
            <Typography.Text className="block !text-xs !text-slate-500">
              Nghỉ cả ngày cần có ngày cụ thể, không áp dụng cho mọi ngày.
            </Typography.Text>
          ) : null}
        </Form>
      </Modal>
    </>
  );
}
