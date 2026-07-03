import {
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  ReloadOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import {
  Avatar,
  Button,
  Card,
  DatePicker,
  Form,
  Input,
  Modal,
  Popconfirm,
  Space,
  Tag,
  TimePicker,
  Tooltip,
  Typography,
  notification,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import type { Dayjs } from 'dayjs';
import { useEffect, useMemo, useRef, useState } from 'react';

import { DashboardPage } from '@/features/dashboard/components/DashboardPage';
import { adminUserRoleAdminApi } from '@/features/admin-users/api/admin-user-api';
import type { AdminStaffOption } from '@/features/admin-users/types/admin-user-type';
import { AppSelect } from '@/shared/components/AppSelect';
import { DataTable } from '@/shared/components/DataTable';
import { useTable } from '@/shared/hooks/useTable';
import { getApiErrorMessage } from '@/shared/utils/api-error';
import { getAssetUrl } from '@/shared/utils/asset-url';
import { getAvatarInitial } from '@/shared/utils/avatar';

import { adminBlockedSlotRoleAdminApi } from '../api/admin-blocked-slot-api';
import {
  ADMIN_BLOCKED_SLOT_STATUS_OPTIONS,
  getAdminBlockedSlotStatusMeta,
} from '../constants/admin-blocked-slot-options';
import type {
  AdminBlockedSlot,
  AdminBlockedSlotFilterParams,
  AdminBlockedSlotFormValues,
  CreateAdminBlockedSlotPayload,
  UpdateAdminBlockedSlotStatusPayload,
} from '../types/admin-blocked-slot-type';

type BlockedSlotFilterFormValues = Pick<AdminBlockedSlotFilterParams, 'keyWord' | 'status'>;

const ALL_STAFF_VALUE = '__ALL_STAFF__';

const formatDate = (value: string) => {
  const parsedDate = dayjs(value);

  return parsedDate.isValid() ? parsedDate.format('DD/MM/YYYY') : value;
};

const formatTime = (value: string) => {
  if (!value) {
    return 'Chưa cập nhật';
  }

  return value.length >= 5 ? value.slice(0, 5) : value;
};

const toCreatePayload = (values: AdminBlockedSlotFormValues): CreateAdminBlockedSlotPayload => ({
  blockedDate: values.blockedDate.format('YYYY-MM-DD'),
  endTime: values.endTime.format('HH:mm:ss'),
  reason: values.reason.trim(),
  startTime: values.startTime.format('HH:mm:ss'),
  status: values.status,
  userId: values.userId && values.userId !== ALL_STAFF_VALUE ? values.userId : undefined,
});

export function AdminBlockedSlotsPage() {
  const [filterForm] = Form.useForm<BlockedSlotFilterFormValues>();
  const [createForm] = Form.useForm<AdminBlockedSlotFormValues>();
  const [updateStatusForm] = Form.useForm<UpdateAdminBlockedSlotStatusPayload>();
  const [toast, toastContextHolder] = notification.useNotification();
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [selectedBlockedSlot, setSelectedBlockedSlot] = useState<AdminBlockedSlot | null>(null);
  const [mutationLoading, setMutationLoading] = useState(false);
  const [staffOptions, setStaffOptions] = useState<AdminStaffOption[]>([]);
  const [staffOptionsLoading, setStaffOptionsLoading] = useState(false);
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
  } = useTable<AdminBlockedSlot, AdminBlockedSlotFilterParams>({
    fetchData: adminBlockedSlotRoleAdminApi.getAll,
    initialPageSize: 10,
  });

  const staffSelectOptions = useMemo(
    () => [
      {
        label: 'Tất cả nhân viên',
        value: ALL_STAFF_VALUE,
      },
      ...staffOptions.map((staff) => ({
        label: staff.name,
        value: staff.id,
      })),
    ],
    [staffOptions],
  );

  useEffect(() => {
    if (!error || lastListErrorRef.current === error) {
      return;
    }

    lastListErrorRef.current = error;
    toast.error({
      message: 'Không thể tải danh sách khóa lịch',
      description: error,
      placement: 'topRight',
    });
  }, [error, toast]);

  const fetchStaffOptions = async () => {
    setStaffOptionsLoading(true);

    try {
      const response = await adminUserRoleAdminApi.getStaffOptions();

      if (!response.success) {
        throw new Error(response.message || 'Không thể tải danh sách nhân viên.');
      }

      setStaffOptions(response.data);
    } catch (staffOptionsError) {
      toast.error({
        message: 'Không thể tải danh sách nhân viên',
        description: getApiErrorMessage(staffOptionsError, 'Vui lòng thử lại sau.'),
        placement: 'topRight',
      });
    } finally {
      setStaffOptionsLoading(false);
    }
  };

  const openCreateModal = () => {
    createForm.setFieldsValue({
      status: 'PENDING',
      userId: ALL_STAFF_VALUE,
    });
    setCreateModalOpen(true);

    if (!staffOptions.length) {
      void fetchStaffOptions();
    }
  };

  const closeCreateModal = () => {
    setCreateModalOpen(false);
    createForm.resetFields();
  };

  const openUpdateStatusModal = (blockedSlot: AdminBlockedSlot) => {
    setSelectedBlockedSlot(blockedSlot);
    updateStatusForm.setFieldsValue({
      status: blockedSlot.status as UpdateAdminBlockedSlotStatusPayload['status'],
    });
  };

  const closeUpdateStatusModal = () => {
    setSelectedBlockedSlot(null);
    updateStatusForm.resetFields();
  };

  const handleCreateBlockedSlot = async (values: AdminBlockedSlotFormValues) => {
    setMutationLoading(true);

    try {
      const response = await adminBlockedSlotRoleAdminApi.create(toCreatePayload(values));

      if (!response.success) {
        throw new Error(response.message || 'Không thể tạo khóa lịch.');
      }

      toast.success({
        message: 'Tạo khóa lịch thành công',
        description: response.message,
        placement: 'topRight',
      });
      closeCreateModal();
      await refetch();
    } catch (createError) {
      toast.error({
        message: 'Tạo khóa lịch thất bại',
        description: getApiErrorMessage(createError, 'Vui lòng thử lại sau.'),
        placement: 'topRight',
      });
    } finally {
      setMutationLoading(false);
    }
  };

  const handleUpdateStatus = async (values: UpdateAdminBlockedSlotStatusPayload) => {
    if (!selectedBlockedSlot) {
      return;
    }

    setMutationLoading(true);

    try {
      const response = await adminBlockedSlotRoleAdminApi.updateStatus(
        selectedBlockedSlot.id,
        values,
      );

      if (!response.success) {
        throw new Error(response.message || 'Không thể cập nhật trạng thái khóa lịch.');
      }

      toast.success({
        message: 'Cập nhật trạng thái thành công',
        description: response.message,
        placement: 'topRight',
      });
      closeUpdateStatusModal();
      await refetch();
    } catch (updateError) {
      toast.error({
        message: 'Cập nhật trạng thái thất bại',
        description: getApiErrorMessage(updateError, 'Vui lòng thử lại sau.'),
        placement: 'topRight',
      });
    } finally {
      setMutationLoading(false);
    }
  };

  const handleDeleteBlockedSlot = async (blockedSlot: AdminBlockedSlot) => {
    setMutationLoading(true);

    try {
      const response = await adminBlockedSlotRoleAdminApi.remove(blockedSlot.id);

      if (!response.success) {
        throw new Error(response.message || 'Không thể xóa khóa lịch.');
      }

      toast.success({
        message: 'Xóa khóa lịch thành công',
        description: response.message,
        placement: 'topRight',
      });
      await refetch();
    } catch (deleteError) {
      toast.error({
        message: 'Xóa khóa lịch thất bại',
        description: getApiErrorMessage(deleteError, 'Vui lòng thử lại sau.'),
        placement: 'topRight',
      });
    } finally {
      setMutationLoading(false);
    }
  };

  const columns: ColumnsType<AdminBlockedSlot> = [
    {
      title: 'Nhân viên',
      dataIndex: 'staffName',
      render: (staffName: string, record) => (
        <Space>
          <Avatar src={getAssetUrl(record.avatarUrl)}>
            {getAvatarInitial(staffName)}
          </Avatar>
          <Typography.Text strong>{staffName || 'Tất cả nhân viên'}</Typography.Text>
        </Space>
      ),
    },
    {
      title: 'Lý do',
      dataIndex: 'reason',
      ellipsis: true,
    },
    {
      title: 'Ngày khóa',
      dataIndex: 'blockedDate',
      width: 130,
      render: formatDate,
    },
    {
      title: 'Khung giờ',
      key: 'timeRange',
      width: 140,
      render: (_, record) => `${formatTime(record.startTime)} - ${formatTime(record.endTime)}`,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      width: 128,
      render: (status: string) => {
        const statusMeta = getAdminBlockedSlotStatusMeta(status);

        return <Tag color={statusMeta.color}>{statusMeta.label}</Tag>;
      },
    },
    {
      title: 'Thao tác',
      key: 'actions',
      fixed: 'right',
      width: 120,
      render: (_, record) => (
        <Space>
          <Tooltip title="Cập nhật trạng thái">
            <Button
              aria-label="Cập nhật trạng thái khóa lịch"
              icon={<EditOutlined />}
              onClick={() => openUpdateStatusModal(record)}
            />
          </Tooltip>
          <Popconfirm
            title="Xóa khóa lịch"
            description="Bạn có chắc muốn xóa khóa lịch này?"
            okText="Xóa"
            cancelText="Hủy"
            okButtonProps={{ danger: true, loading: mutationLoading }}
            onConfirm={() => void handleDeleteBlockedSlot(record)}
          >
            <Tooltip title="Xóa khóa lịch">
              <Button aria-label="Xóa khóa lịch" danger icon={<DeleteOutlined />} />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const handleSearch = (values: BlockedSlotFilterFormValues) => {
    handleFilterChange({
      keyWord: values.keyWord?.trim() || undefined,
      status: values.status,
    });
  };

  const handleReset = () => {
    filterForm.resetFields();
    resetFilters();
  };

  return (
    <>
      {toastContextHolder}

      <DashboardPage
        title="Quản lý khóa lịch"
        description="Tạo và kiểm soát các khoảng thời gian nhân viên tạm ngưng nhận lịch."
        actions={
          <Space>
            <Button icon={<ReloadOutlined />} loading={loading} onClick={() => void refetch()}>
              Tải lại
            </Button>
            <Button type="primary" icon={<PlusOutlined />} onClick={openCreateModal}>
              Thêm khóa lịch
            </Button>
          </Space>
        }
      >
        <Card>
          <Form<BlockedSlotFilterFormValues>
            form={filterForm}
            layout="vertical"
            initialValues={filters}
            onFinish={handleSearch}
          >
            <div className="grid gap-3 md:grid-cols-[1fr_220px_auto] md:items-end">
              <Form.Item name="keyWord" label="Tìm kiếm" className="!mb-0">
                <Input allowClear placeholder="Tên nhân viên hoặc lý do" prefix={<SearchOutlined />} />
              </Form.Item>
              <Form.Item name="status" label="Trạng thái" className="!mb-0">
                <AppSelect
                  allowClear
                  options={ADMIN_BLOCKED_SLOT_STATUS_OPTIONS}
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

        <DataTable<AdminBlockedSlot>
          rowKey="id"
          dataSource={items}
          loading={loading}
          title="Danh sách khóa lịch"
          columns={columns}
          locale={{
            emptyText: 'Chưa có khóa lịch nào.',
          }}
          paginationConfig={{
            current: currentPage,
            onChange: handlePageChange,
            pageSize,
            total,
          }}
        />
      </DashboardPage>

      <Modal
        open={createModalOpen}
        title="Thêm khóa lịch"
        okText="Tạo khóa lịch"
        cancelText="Hủy"
        confirmLoading={mutationLoading}
        onCancel={closeCreateModal}
        onOk={() => void createForm.submit()}
      >
        <Form<AdminBlockedSlotFormValues>
          form={createForm}
          layout="vertical"
          onFinish={handleCreateBlockedSlot}
        >
          <Form.Item name="userId" label="Nhân viên">
            <AppSelect
              loading={staffOptionsLoading}
              options={staffSelectOptions}
              placeholder="Tất cả nhân viên"
            />
          </Form.Item>
          <Form.Item
            name="reason"
            label="Lý do"
            rules={[{ required: true, message: 'Vui lòng nhập lý do khóa lịch.' }]}
          >
            <Input.TextArea rows={3} placeholder="Nhập lý do khóa lịch" />
          </Form.Item>
          <Form.Item
            name="blockedDate"
            label="Ngày khóa"
            rules={[{ required: true, message: 'Vui lòng chọn ngày khóa.' }]}
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
                  validator(_, value) {
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
          <Form.Item
            name="status"
            label="Trạng thái"
            rules={[{ required: true, message: 'Vui lòng chọn trạng thái.' }]}
          >
            <AppSelect options={ADMIN_BLOCKED_SLOT_STATUS_OPTIONS} placeholder="Chọn trạng thái" />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        open={Boolean(selectedBlockedSlot)}
        title="Cập nhật trạng thái khóa lịch"
        okText="Lưu thay đổi"
        cancelText="Hủy"
        confirmLoading={mutationLoading}
        onCancel={closeUpdateStatusModal}
        onOk={() => void updateStatusForm.submit()}
      >
        <div className="mb-5">
          <Typography.Text strong>{selectedBlockedSlot?.staffName || 'Tất cả nhân viên'}</Typography.Text>
          <div className="text-sm text-slate-500">
            {selectedBlockedSlot
              ? `${formatDate(selectedBlockedSlot.blockedDate)} | ${formatTime(
                  selectedBlockedSlot.startTime,
                )} - ${formatTime(selectedBlockedSlot.endTime)}`
              : null}
          </div>
        </div>

        <Form<UpdateAdminBlockedSlotStatusPayload>
          form={updateStatusForm}
          layout="vertical"
          onFinish={handleUpdateStatus}
        >
          <Form.Item
            name="status"
            label="Trạng thái"
            rules={[{ required: true, message: 'Vui lòng chọn trạng thái.' }]}
          >
            <AppSelect options={ADMIN_BLOCKED_SLOT_STATUS_OPTIONS} placeholder="Chọn trạng thái" />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}
