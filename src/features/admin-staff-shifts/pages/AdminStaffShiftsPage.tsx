import {
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

import { adminUserRoleAdminApi } from '@/features/admin-users/api/admin-user-api';
import type { AdminStaffOption } from '@/features/admin-users/types/admin-user-type';
import { DashboardPage } from '@/features/dashboard/components/DashboardPage';
import { AppSelect } from '@/shared/components/AppSelect';
import { DataTable } from '@/shared/components/DataTable';
import { useTable } from '@/shared/hooks/useTable';
import { getApiErrorMessage } from '@/shared/utils/api-error';
import { getAssetUrl } from '@/shared/utils/asset-url';
import { getAvatarInitial } from '@/shared/utils/avatar';
import { formatDate, formatTimeRange } from '@/shared/utils/date-format';

import { adminStaffShiftRoleAdminApi } from '../api/admin-staff-shift-api';
import {
  ADMIN_STAFF_SHIFT_STATUS_OPTIONS,
  getAdminStaffShiftStatusMeta,
} from '../constants/admin-staff-shift-options';
import type {
  AdminStaffShift,
  AdminStaffShiftFilterParams,
  AdminStaffShiftFormValues,
  CreateAdminStaffShiftPayload,
  UpdateAdminStaffShiftPayload,
} from '../types/admin-staff-shift-type';

type StaffShiftModalMode = 'create' | 'update';
type StaffShiftFilterFormValues = Pick<AdminStaffShiftFilterParams, 'keyWord' | 'status'>;

const toCreatePayload = (values: AdminStaffShiftFormValues): CreateAdminStaffShiftPayload => ({
  endTime: values.endTime.format('HH:mm:ss'),
  staffId: values.staffId,
  startTime: values.startTime.format('HH:mm:ss'),
  workDate: values.workDate.format('YYYY-MM-DD'),
});

const toUpdatePayload = (values: AdminStaffShiftFormValues): UpdateAdminStaffShiftPayload => ({
  ...toCreatePayload(values),
  status: values.status ?? 'PENDING',
});

const toTimeValue = (value: string) => {
  const normalizedValue = value.length === 5 ? `${value}:00` : value;
  const parsedTime = dayjs(`2026-01-01T${normalizedValue}`);

  return parsedTime.isValid() ? parsedTime : undefined;
};

export function AdminStaffShiftsPage() {
  const [filterForm] = Form.useForm<StaffShiftFilterFormValues>();
  const [shiftForm] = Form.useForm<AdminStaffShiftFormValues>();
  const [toast, toastContextHolder] = notification.useNotification();
  const [modalMode, setModalMode] = useState<StaffShiftModalMode>('create');
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedShift, setSelectedShift] = useState<AdminStaffShift | null>(null);
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
  } = useTable<AdminStaffShift, AdminStaffShiftFilterParams>({
    fetchData: adminStaffShiftRoleAdminApi.getAll,
    initialPageSize: 10,
  });

  const staffSelectOptions = useMemo(
    () =>
      staffOptions.map((staff) => ({
        label: staff.name,
        value: staff.id,
      })),
    [staffOptions],
  );

  useEffect(() => {
    if (!error || lastListErrorRef.current === error) {
      return;
    }

    lastListErrorRef.current = error;
    toast.error({
      message: 'Không thể tải danh sách ca làm việc',
      description: error,
      placement: 'topRight',
    });
  }, [error, toast]);

  useEffect(() => {
    if (!selectedShift || !staffOptions.length || shiftForm.getFieldValue('staffId')) {
      return;
    }

    const staffOption = staffOptions.find((staff) => staff.name === selectedShift.staffName);

    if (staffOption) {
      shiftForm.setFieldValue('staffId', staffOption.id);
    }
  }, [selectedShift, shiftForm, staffOptions]);

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
    setModalMode('create');
    setSelectedShift(null);
    shiftForm.resetFields();
    setModalOpen(true);

    if (!staffOptions.length) {
      void fetchStaffOptions();
    }
  };

  const openUpdateModal = (shift: AdminStaffShift) => {
    setModalMode('update');
    setSelectedShift(shift);
    shiftForm.setFieldsValue({
      endTime: toTimeValue(shift.endTime),
      staffId: staffOptions.find((staff) => staff.name === shift.staffName)?.id,
      startTime: toTimeValue(shift.startTime),
      status: shift.status as UpdateAdminStaffShiftPayload['status'],
      workDate: dayjs(shift.workDate),
    });
    setModalOpen(true);

    if (!staffOptions.length) {
      void fetchStaffOptions();
    }
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedShift(null);
    shiftForm.resetFields();
  };

  const handleSubmitShift = async (values: AdminStaffShiftFormValues) => {
    setMutationLoading(true);

    try {
      const response =
        modalMode === 'create'
          ? await adminStaffShiftRoleAdminApi.create(toCreatePayload(values))
          : await adminStaffShiftRoleAdminApi.update(selectedShift!.id, toUpdatePayload(values));

      if (!response.success) {
        throw new Error(response.message || 'Không thể lưu ca làm việc.');
      }

      toast.success({
        message: modalMode === 'create' ? 'Tạo ca làm việc thành công' : 'Cập nhật ca làm việc thành công',
        description: response.message,
        placement: 'topRight',
      });
      closeModal();
      await refetch();
    } catch (submitError) {
      toast.error({
        message: modalMode === 'create' ? 'Tạo ca làm việc thất bại' : 'Cập nhật ca làm việc thất bại',
        description: getApiErrorMessage(submitError, 'Vui lòng thử lại sau.'),
        placement: 'topRight',
      });
    } finally {
      setMutationLoading(false);
    }
  };

  const columns: ColumnsType<AdminStaffShift> = [
    {
      title: 'Nhân viên',
      dataIndex: 'staffName',
      render: (staffName: string, record) => (
        <Space>
          <Avatar src={getAssetUrl(record.staffAvatar)}>
            {getAvatarInitial(staffName)}
          </Avatar>
          <Typography.Text strong>{staffName || 'Chưa cập nhật'}</Typography.Text>
        </Space>
      ),
    },
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
      width: 128,
      render: (status: string) => {
        const statusMeta = getAdminStaffShiftStatusMeta(status);

        return <Tag color={statusMeta.color}>{statusMeta.label}</Tag>;
      },
    },
    {
      title: 'Thao tác',
      key: 'actions',
      fixed: 'right',
      width: 96,
      render: (_, record) => (
        <Tooltip title="Cập nhật ca làm việc">
          <Button
            aria-label="Cập nhật ca làm việc"
            icon={<EditOutlined />}
            onClick={() => openUpdateModal(record)}
          />
        </Tooltip>
      ),
    },
  ];

  const handleSearch = (values: StaffShiftFilterFormValues) => {
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
        title="Quản lý ca làm việc"
        description="Thiết lập ca làm việc, thời gian bắt đầu, kết thúc và trạng thái áp dụng."
        actions={
          <Space>
            <Button icon={<ReloadOutlined />} loading={loading} onClick={() => void refetch()}>
              Tải lại
            </Button>
            <Button type="primary" icon={<PlusOutlined />} onClick={openCreateModal}>
              Thêm ca làm việc
            </Button>
          </Space>
        }
      >
        <Card>
          <Form<StaffShiftFilterFormValues>
            form={filterForm}
            layout="vertical"
            initialValues={filters}
            onFinish={handleSearch}
          >
            <div className="grid gap-3 md:grid-cols-[1fr_220px_auto] md:items-end">
              <Form.Item name="keyWord" label="Tìm kiếm" className="!mb-0">
                <Input allowClear placeholder="Tên nhân viên hoặc dịch vụ" prefix={<SearchOutlined />} />
              </Form.Item>
              <Form.Item name="status" label="Trạng thái" className="!mb-0">
                <AppSelect
                  allowClear
                  options={ADMIN_STAFF_SHIFT_STATUS_OPTIONS}
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

        <DataTable<AdminStaffShift>
          rowKey="id"
          dataSource={items}
          loading={loading}
          title="Danh sách ca làm việc"
          columns={columns}
          locale={{
            emptyText: 'Chưa có ca làm việc nào.',
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
        open={modalOpen}
        title={modalMode === 'create' ? 'Thêm ca làm việc' : 'Cập nhật ca làm việc'}
        okText={modalMode === 'create' ? 'Tạo ca làm việc' : 'Lưu thay đổi'}
        cancelText="Hủy"
        confirmLoading={mutationLoading}
        onCancel={closeModal}
        onOk={() => void shiftForm.submit()}
      >
        <Form<AdminStaffShiftFormValues>
          form={shiftForm}
          layout="vertical"
          onFinish={handleSubmitShift}
        >
          <Form.Item
            name="staffId"
            label="Nhân viên"
            rules={[{ required: true, message: 'Vui lòng chọn nhân viên.' }]}
          >
            <AppSelect
              loading={staffOptionsLoading}
              options={staffSelectOptions}
              placeholder="Chọn nhân viên"
            />
          </Form.Item>
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
          {modalMode === 'update' ? (
            <Form.Item
              name="status"
              label="Trạng thái"
              rules={[{ required: true, message: 'Vui lòng chọn trạng thái.' }]}
            >
              <AppSelect options={ADMIN_STAFF_SHIFT_STATUS_OPTIONS} placeholder="Chọn trạng thái" />
            </Form.Item>
          ) : null}
        </Form>
      </Modal>
    </>
  );
}
