import {
  DeleteOutlined,
  EyeOutlined,
  PlusOutlined,
  ReloadOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import {
  Avatar,
  Button,
  Card,
  Descriptions,
  Form,
  Input,
  Modal,
  Popconfirm,
  Space,
  Tag,
  Tooltip,
  Typography,
  notification,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useEffect, useMemo, useRef, useState } from 'react';

import { adminServiceRoleAdminApi } from '@/features/admin-services/api/admin-service-api';
import type { AdminServiceOption } from '@/features/admin-services/types/admin-service-type';
import { adminUserRoleAdminApi } from '@/features/admin-users/api/admin-user-api';
import type { AdminStaffOption } from '@/features/admin-users/types/admin-user-type';
import { DashboardPage } from '@/features/dashboard/components/DashboardPage';
import { AppSelect } from '@/shared/components/AppSelect';
import { DataTable } from '@/shared/components/DataTable';
import { useTable } from '@/shared/hooks/useTable';
import { getApiErrorMessage } from '@/shared/utils/api-error';
import { getAssetUrl } from '@/shared/utils/asset-url';
import { getAvatarInitial } from '@/shared/utils/avatar';

import { adminStaffServiceRoleAdminApi } from '../api/admin-staff-service-api';
import {
  ADMIN_STAFF_SERVICE_STATUS_OPTIONS,
  getAdminStaffServiceStatusMeta,
} from '../constants/admin-staff-service-options';
import type {
  AdminStaffService,
  AdminStaffServiceFilterParams,
  AdminStaffServiceFormValues,
} from '../types/admin-staff-service-type';

type StaffServiceFilterFormValues = Pick<AdminStaffServiceFilterParams, 'keyword' | 'status'>;

export function AdminStaffServicesPage() {
  const [filterForm] = Form.useForm<StaffServiceFilterFormValues>();
  const [assignmentForm] = Form.useForm<AdminStaffServiceFormValues>();
  const [toast, toastContextHolder] = notification.useNotification();
  const [modalOpen, setModalOpen] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState<AdminStaffService | null>(null);
  const [mutationLoading, setMutationLoading] = useState(false);
  const [staffOptions, setStaffOptions] = useState<AdminStaffOption[]>([]);
  const [serviceOptions, setServiceOptions] = useState<AdminServiceOption[]>([]);
  const [staffOptionsLoading, setStaffOptionsLoading] = useState(false);
  const [serviceOptionsLoading, setServiceOptionsLoading] = useState(false);
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
  } = useTable<AdminStaffService, AdminStaffServiceFilterParams>({
    fetchData: adminStaffServiceRoleAdminApi.getAll,
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

  const serviceSelectOptions = useMemo(
    () =>
      serviceOptions.map((service) => ({
        label: service.name,
        value: service.id,
      })),
    [serviceOptions],
  );

  useEffect(() => {
    if (!error || lastListErrorRef.current === error) {
      return;
    }

    lastListErrorRef.current = error;
    toast.error({
      message: 'Không thể tải danh sách phân công',
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

  const fetchServiceOptions = async () => {
    setServiceOptionsLoading(true);

    try {
      const response = await adminServiceRoleAdminApi.getServiceOptions();

      if (!response.success) {
        throw new Error(response.message || 'Không thể tải danh sách dịch vụ.');
      }

      setServiceOptions(response.data);
    } catch (serviceOptionsError) {
      toast.error({
        message: 'Không thể tải danh sách dịch vụ',
        description: getApiErrorMessage(serviceOptionsError, 'Vui lòng thử lại sau.'),
        placement: 'topRight',
      });
    } finally {
      setServiceOptionsLoading(false);
    }
  };

  const fetchFormOptions = () => {
    if (!staffOptions.length) {
      void fetchStaffOptions();
    }

    if (!serviceOptions.length) {
      void fetchServiceOptions();
    }
  };

  const openCreateModal = () => {
    assignmentForm.resetFields();
    setModalOpen(true);
    fetchFormOptions();
  };

  const closeCreateModal = () => {
    setModalOpen(false);
    assignmentForm.resetFields();
  };

  const openDetailModal = (assignment: AdminStaffService) => {
    setSelectedAssignment(assignment);
    setDetailOpen(true);
  };

  const closeDetailModal = () => {
    setSelectedAssignment(null);
    setDetailOpen(false);
  };

  const handleCreateAssignment = async (values: AdminStaffServiceFormValues) => {
    setMutationLoading(true);

    try {
      const response = await adminStaffServiceRoleAdminApi.create(values);

      if (!response.success) {
        throw new Error(response.message || 'Không thể tạo phân công.');
      }

      toast.success({
        message: 'Tạo phân công thành công',
        description: response.message,
        placement: 'topRight',
      });
      closeCreateModal();
      await refetch();
    } catch (createError) {
      toast.error({
        message: 'Tạo phân công thất bại',
        description: getApiErrorMessage(createError, 'Vui lòng thử lại sau.'),
        placement: 'topRight',
      });
    } finally {
      setMutationLoading(false);
    }
  };

  const handleDeleteAssignment = async (assignment: AdminStaffService) => {
    setMutationLoading(true);

    try {
      const response = await adminStaffServiceRoleAdminApi.remove(assignment.id);

      if (!response.success) {
        throw new Error(response.message || 'Không thể xóa phân công.');
      }

      toast.success({
        message: 'Xóa phân công thành công',
        description: response.message,
        placement: 'topRight',
      });
      await refetch();
    } catch (deleteError) {
      toast.error({
        message: 'Xóa phân công thất bại',
        description: getApiErrorMessage(deleteError, 'Vui lòng thử lại sau.'),
        placement: 'topRight',
      });
    } finally {
      setMutationLoading(false);
    }
  };

  const columns: ColumnsType<AdminStaffService> = [
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
      title: 'Dịch vụ',
      dataIndex: 'serviceName',
      render: (serviceName: string) => <Typography.Text>{serviceName || 'Chưa cập nhật'}</Typography.Text>,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      width: 150,
      render: (status: string) => {
        const statusMeta = getAdminStaffServiceStatusMeta(status);

        return <Tag color={statusMeta.color}>{statusMeta.label}</Tag>;
      },
    },
    {
      title: 'Thao tác',
      key: 'actions',
      fixed: 'right',
      width: 128,
      render: (_, record) => (
        <Space>
          <Tooltip title="Xem chi tiết">
            <Button
              aria-label="Xem chi tiết phân công"
              icon={<EyeOutlined />}
              onClick={() => openDetailModal(record)}
            />
          </Tooltip>
          <Popconfirm
            title="Xóa phân công"
            description="Bạn có chắc muốn xóa phân công này?"
            okText="Xóa"
            cancelText="Hủy"
            okButtonProps={{ danger: true, loading: mutationLoading }}
            onConfirm={() => void handleDeleteAssignment(record)}
          >
            <Tooltip title="Xóa phân công">
              <Button aria-label="Xóa phân công" danger icon={<DeleteOutlined />} />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const handleSearch = (values: StaffServiceFilterFormValues) => {
    handleFilterChange({
      keyword: values.keyword?.trim() || undefined,
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
        title="Phân công nhân viên"
        description="Phân công nhân viên phụ trách từng dịch vụ để khách hàng chọn đúng chuyên viên."
        actions={
          <Space>
            <Button icon={<ReloadOutlined />} loading={loading} onClick={() => void refetch()}>
              Tải lại
            </Button>
            <Button type="primary" icon={<PlusOutlined />} onClick={openCreateModal}>
              Thêm phân công
            </Button>
          </Space>
        }
      >
        <Card>
          <Form<StaffServiceFilterFormValues>
            form={filterForm}
            layout="vertical"
            initialValues={filters}
            onFinish={handleSearch}
          >
            <div className="grid gap-3 md:grid-cols-[1fr_220px_auto] md:items-end">
              <Form.Item name="keyword" label="Tìm kiếm" className="!mb-0">
                <Input allowClear placeholder="Tên nhân viên hoặc dịch vụ" prefix={<SearchOutlined />} />
              </Form.Item>
              <Form.Item name="status" label="Trạng thái" className="!mb-0">
                <AppSelect
                  allowClear
                  options={ADMIN_STAFF_SERVICE_STATUS_OPTIONS}
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

        <DataTable<AdminStaffService>
          rowKey="id"
          dataSource={items}
          loading={loading}
          title="Danh sách phân công"
          columns={columns}
          locale={{
            emptyText: 'Chưa có phân công nào.',
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
        title="Thêm phân công"
        okText="Tạo phân công"
        cancelText="Hủy"
        confirmLoading={mutationLoading}
        onCancel={closeCreateModal}
        onOk={() => void assignmentForm.submit()}
      >
        <Form<AdminStaffServiceFormValues>
          form={assignmentForm}
          layout="vertical"
          onFinish={handleCreateAssignment}
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
            name="serviceId"
            label="Dịch vụ"
            rules={[{ required: true, message: 'Vui lòng chọn dịch vụ.' }]}
          >
            <AppSelect
              loading={serviceOptionsLoading}
              options={serviceSelectOptions}
              placeholder="Chọn dịch vụ"
            />
          </Form.Item>
        </Form>
      </Modal>

      <Modal open={detailOpen} title="Chi tiết phân công" footer={null} onCancel={closeDetailModal}>
        {selectedAssignment ? (
          <Descriptions column={1} bordered size="small">
            <Descriptions.Item label="Nhân viên">
              <Space>
                <Avatar src={getAssetUrl(selectedAssignment.staffAvatar)}>
                  {getAvatarInitial(selectedAssignment.staffName)}
                </Avatar>
                <Typography.Text strong>{selectedAssignment.staffName}</Typography.Text>
              </Space>
            </Descriptions.Item>
            <Descriptions.Item label="Dịch vụ">{selectedAssignment.serviceName}</Descriptions.Item>
            <Descriptions.Item label="Trạng thái">
              <Tag color={getAdminStaffServiceStatusMeta(selectedAssignment.status).color}>
                {getAdminStaffServiceStatusMeta(selectedAssignment.status).label}
              </Tag>
            </Descriptions.Item>
          </Descriptions>
        ) : null}
      </Modal>
    </>
  );
}
