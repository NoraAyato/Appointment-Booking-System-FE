import {
  EditOutlined,
  ReloadOutlined,
  SearchOutlined,
  TeamOutlined,
  UserSwitchOutlined,
} from '@ant-design/icons';
import {
  Avatar,
  Button,
  Card,
  Col,
  Form,
  Input,
  Modal,
  Row,
  Space,
  Tag,
  Tooltip,
  Typography,
  notification,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useEffect, useRef, useState } from 'react';

import { DashboardPage } from '@/features/dashboard/components/DashboardPage';
import { AppSelect } from '@/shared/components/AppSelect';
import { DataTable } from '@/shared/components/DataTable';
import { useTable } from '@/shared/hooks/useTable';
import { getApiErrorMessage } from '@/shared/utils/api-error';
import { getAvatarInitial } from '@/shared/utils/avatar';
import { formatDate } from '@/shared/utils/date-format';

import { adminUserRoleAdminApi } from '../api/admin-user-api';
import {
  ADMIN_USER_ROLE_OPTIONS,
  ADMIN_USER_STATUS_OPTIONS,
  getAdminUserRoleLabel,
  getAdminUserStatusMeta,
  normalizeAdminUserStatus,
} from '../constants/admin-user-options';
import { useAdminUserStats } from '../hooks/useAdminUserStats';
import type {
  AdminUser,
  AdminUserFilterParams,
  UpdateUserInfoPayload,
} from '../types/admin-user-type';

type AdminUserFilterFormValues = Omit<AdminUserFilterParams, 'page' | 'limit'>;

export function AdminUsersPage() {
  const [form] = Form.useForm<AdminUserFilterFormValues>();
  const [updateForm] = Form.useForm<UpdateUserInfoPayload>();
  const [toast, toastContextHolder] = notification.useNotification();
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [updateLoading, setUpdateLoading] = useState(false);
  const lastListErrorRef = useRef<string | null>(null);
  const lastStatsErrorRef = useRef<string | null>(null);
  const {
    error: statsError,
    loading: statsLoading,
    refetch: refetchStats,
    stats,
  } = useAdminUserStats();
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
  } = useTable<AdminUser, AdminUserFilterParams>({
    fetchData: adminUserRoleAdminApi.getAll,
    initialPageSize: 10,
  });

  useEffect(() => {
    if (!error || lastListErrorRef.current === error) {
      return;
    }

    lastListErrorRef.current = error;
    toast.error({
      message: 'Không thể tải danh sách người dùng',
      description: error,
      placement: 'topRight',
    });
  }, [error, toast]);

  useEffect(() => {
    if (!statsError || lastStatsErrorRef.current === statsError) {
      return;
    }

    lastStatsErrorRef.current = statsError;
    toast.error({
      message: 'Không thể tải thống kê người dùng',
      description: statsError,
      placement: 'topRight',
    });
  }, [statsError, toast]);

  const openUpdateModal = (record: AdminUser) => {
    setSelectedUser(record);
    updateForm.setFieldsValue({
      role: record.role as UpdateUserInfoPayload['role'],
      status: normalizeAdminUserStatus(record.status),
    });
  };

  const closeUpdateModal = () => {
    setSelectedUser(null);
    updateForm.resetFields();
  };

  const handleUpdateUser = async (values: UpdateUserInfoPayload) => {
    if (!selectedUser) {
      return;
    }

    setUpdateLoading(true);

    try {
      const response = await adminUserRoleAdminApi.update(selectedUser.id, values);

      if (!response.success) {
        throw new Error(response.message || 'Cập nhật người dùng thất bại.');
      }

      toast.success({
        message: 'Cập nhật người dùng thành công',
        description: response.message,
        placement: 'topRight',
      });
      closeUpdateModal();
      await Promise.all([refetch(), refetchStats()]);
    } catch (updateError) {
      toast.error({
        message: 'Cập nhật người dùng thất bại',
        description: getApiErrorMessage(updateError, 'Vui lòng thử lại sau.'),
        placement: 'topRight',
      });
    } finally {
      setUpdateLoading(false);
    }
  };

  const columns: ColumnsType<AdminUser> = [
    {
      title: 'Người dùng',
      dataIndex: 'name',
      render: (_, record) => (
        <Space>
          <Avatar src={record.avatar || undefined}>
            {getAvatarInitial(record.name || record.email)}
          </Avatar>
          <div>
            <Typography.Text strong>{record.name || 'Chưa cập nhật'}</Typography.Text>
            <div className="text-xs text-slate-500">{record.email}</div>
          </div>
        </Space>
      ),
    },
    {
      title: 'Số điện thoại',
      dataIndex: 'phone',
      render: (phone: string) => phone || 'Chưa cập nhật',
    },
    {
      title: 'Vai trò',
      dataIndex: 'role',
      render: (role: string) => <Tag color="blue">{getAdminUserRoleLabel(role)}</Tag>,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      render: (status: string) => {
        const statusMeta = getAdminUserStatusMeta(status);

        return <Tag color={statusMeta.color}>{statusMeta.label}</Tag>;
      },
    },
    {
      title: 'Ngày tham gia',
      dataIndex: 'joinDate',
      render: (joinDate: string) => formatDate(joinDate),
    },
    {
      title: 'Thao tác',
      key: 'actions',
      fixed: 'right',
      width: 96,
      render: (_, record) => (
        <Tooltip title="Cập nhật vai trò và trạng thái">
          <Button
            aria-label="Cập nhật người dùng"
            icon={<EditOutlined />}
            onClick={() => openUpdateModal(record)}
          />
        </Tooltip>
      ),
    },
  ];

  const handleSearch = (values: AdminUserFilterFormValues) => {
    handleFilterChange({
      role: values.role,
      search: values.search?.trim() || undefined,
      status: values.status,
    });
  };

  const handleReset = () => {
    form.resetFields();
    resetFilters();
  };

  return (
    <>
      {toastContextHolder}

      <DashboardPage
        title="Quản lí người dùng"
        description="Quản lý tài khoản khách hàng, nhân viên và quản trị viên."
        actions={
          <Button
            icon={<ReloadOutlined />}
            loading={loading || statsLoading}
            onClick={() => {
              void refetch();
              void refetchStats();
            }}
          >
            Tải lại
          </Button>
        }
      >
        <Row gutter={[16, 16]}>
          <Col xs={24} md={8}>
            <Card loading={statsLoading} className="admin-user-stat-card">
              <Space align="center" size={12} className="admin-user-stat">
                <TeamOutlined className="dashboard-icon" />
                <div>
                  <Typography.Text className="text-slate-500">Tổng người dùng</Typography.Text>
                  <Typography.Title level={3} className="!mb-0 !mt-1">
                    {stats.totalUsers}
                  </Typography.Title>
                </div>
              </Space>
            </Card>
          </Col>
          <Col xs={24} md={8}>
            <Card loading={statsLoading} className="admin-user-stat-card">
              <Space align="center" size={12} className="admin-user-stat">
                <UserSwitchOutlined className="dashboard-icon blue" />
                <div>
                  <Typography.Text className="text-slate-500">Đang hoạt động</Typography.Text>
                  <Typography.Title level={3} className="!mb-0 !mt-1">
                    {stats.activeUsers}
                  </Typography.Title>
                </div>
              </Space>
            </Card>
          </Col>
          <Col xs={24} md={8}>
            <Card loading={statsLoading} className="admin-user-stat-card">
              <Space align="center" size={12} className="admin-user-stat">
                <UserSwitchOutlined className="dashboard-icon amber" />
                <div>
                  <Typography.Text className="text-slate-500">Ngừng hoạt động</Typography.Text>
                  <Typography.Title level={3} className="!mb-0 !mt-1">
                    {stats.inactiveUsers}
                  </Typography.Title>
                </div>
              </Space>
            </Card>
          </Col>
        </Row>

        <Card className="mt-6">
          <Form<AdminUserFilterFormValues>
            form={form}
            layout="vertical"
            initialValues={filters}
            onFinish={handleSearch}
          >
            <Row gutter={[16, 12]} align="bottom">
              <Col xs={24} lg={10}>
                <Form.Item name="search" label="Tìm kiếm" className="!mb-0">
                  <Input
                    allowClear
                    placeholder="Tên, email hoặc số điện thoại"
                    prefix={<SearchOutlined />}
                  />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12} lg={5}>
                <Form.Item name="role" label="Vai trò" className="!mb-0">
                  <AppSelect
                    allowClear
                    options={ADMIN_USER_ROLE_OPTIONS}
                    placeholder="Tất cả vai trò"
                  />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12} lg={5}>
                <Form.Item name="status" label="Trạng thái" className="!mb-0">
                  <AppSelect
                    allowClear
                    options={ADMIN_USER_STATUS_OPTIONS}
                    placeholder="Tất cả trạng thái"
                  />
                </Form.Item>
              </Col>
              <Col xs={24} lg={4}>
                <Space className="w-full justify-end">
                  <Button onClick={handleReset}>Đặt lại</Button>
                  <Button type="primary" htmlType="submit" icon={<SearchOutlined />}>
                    Tìm
                  </Button>
                </Space>
              </Col>
            </Row>
          </Form>
        </Card>

        <DataTable<AdminUser>
          rowKey="id"
          dataSource={items}
          loading={loading}
          title="Danh sách người dùng"
          columns={columns}
          locale={{
            emptyText: 'Chưa có người dùng nào.',
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
        open={Boolean(selectedUser)}
        title="Cập nhật người dùng"
        okText="Lưu thay đổi"
        cancelText="Hủy"
        confirmLoading={updateLoading}
        onCancel={closeUpdateModal}
        onOk={() => void updateForm.submit()}
      >
        <div className="mb-5">
          <Typography.Text strong>{selectedUser?.name || 'Người dùng'}</Typography.Text>
          <div className="text-sm text-slate-500">{selectedUser?.email}</div>
        </div>

        <Form<UpdateUserInfoPayload> form={updateForm} layout="vertical" onFinish={handleUpdateUser}>
          <Form.Item
            name="role"
            label="Vai trò"
            rules={[{ required: true, message: 'Vui lòng chọn vai trò.' }]}
          >
            <AppSelect options={ADMIN_USER_ROLE_OPTIONS} placeholder="Chọn vai trò" />
          </Form.Item>
          <Form.Item
            name="status"
            label="Trạng thái"
            rules={[{ required: true, message: 'Vui lòng chọn trạng thái.' }]}
          >
            <AppSelect options={ADMIN_USER_STATUS_OPTIONS} placeholder="Chọn trạng thái" />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}
