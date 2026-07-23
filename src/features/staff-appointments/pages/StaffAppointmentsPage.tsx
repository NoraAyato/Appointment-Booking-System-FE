import {
  CheckCircleOutlined,
  EyeOutlined,
  ReloadOutlined,
  SearchOutlined,
  UploadOutlined,
} from '@ant-design/icons';
import {
  Avatar,
  Button,
  Card,
  DatePicker,
  Descriptions,
  Form,
  Image,
  Input,
  Modal,
  Space,
  Tag,
  Tooltip,
  Typography,
  Upload,
  notification,
} from 'antd';
import type { UploadFile, UploadProps } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useEffect, useRef, useState } from 'react';

import { DashboardPage } from '@/features/dashboard/components/DashboardPage';
import { AppSelect } from '@/shared/components/AppSelect';
import { DataTable } from '@/shared/components/DataTable';
import { useTable } from '@/shared/hooks/useTable';
import { getApiErrorMessage } from '@/shared/utils/api-error';
import { getAssetUrl } from '@/shared/utils/asset-url';
import { getAvatarInitial } from '@/shared/utils/avatar';
import { formatAppointmentDateTimeRange, formatDateTime } from '@/shared/utils/date-format';

import { staffAppointmentRoleStaffApi } from '../api/staff-appointment-api';
import {
  STAFF_APPOINTMENT_STATUS_OPTIONS,
  getStaffAppointmentStatusMeta,
} from '../constants/staff-appointment-options';
import type {
  StaffAppointment,
  StaffAppointmentFilterFormValues,
  StaffAppointmentFilterParams,
  StaffAppointmentStatus,
} from '../types/staff-appointment-type';

const MAX_RESULT_IMAGE_SIZE_MB = 5;
const MAX_RESULT_IMAGE_SIZE = MAX_RESULT_IMAGE_SIZE_MB * 1024 * 1024;
const ACCEPTED_RESULT_IMAGE_TYPES = new Set(['image/jpeg', 'image/jpg', 'image/png', 'image/gif']);

const isCompletableAppointment = (status?: string) => status === 'CONFIRMED';

export function StaffAppointmentsPage() {
  const [filterForm] = Form.useForm<StaffAppointmentFilterFormValues>();
  const [toast, toastContextHolder] = notification.useNotification();
  const [selectedAppointment, setSelectedAppointment] = useState<StaffAppointment | null>(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [completeModalOpen, setCompleteModalOpen] = useState(false);
  const [completeUploadFiles, setCompleteUploadFiles] = useState<UploadFile[]>([]);
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
  } = useTable<StaffAppointment, StaffAppointmentFilterParams>({
    fetchData: staffAppointmentRoleStaffApi.getAll,
    initialPageSize: 10,
  });

  useEffect(() => {
    if (!error || lastListErrorRef.current === error) {
      return;
    }

    lastListErrorRef.current = error;
    toast.error({
      message: 'Không thể tải danh sách lịch hẹn',
      description: error,
      placement: 'topRight',
    });
  }, [error, toast]);

  const handleSearch = (values: StaffAppointmentFilterFormValues) => {
    handleFilterChange({
      date: values.date?.format('YYYY-MM-DD'),
      keyWord: values.keyWord?.trim() || undefined,
      status: values.status,
    });
  };

  const handleReset = () => {
    filterForm.resetFields();
    resetFilters();
  };

  const openDetailModal = (appointment: StaffAppointment) => {
    setSelectedAppointment(appointment);
    setDetailModalOpen(true);
  };

  const closeDetailModal = () => {
    setDetailModalOpen(false);
  };

  const openCompleteModal = (appointment: StaffAppointment) => {
    setSelectedAppointment(appointment);
    setCompleteUploadFiles([]);
    setCompleteModalOpen(true);
  };

  const closeCompleteModal = () => {
    setCompleteModalOpen(false);
    setCompleteUploadFiles([]);
  };

  const handleBeforeUpload: UploadProps['beforeUpload'] = (file) => {
    if (!ACCEPTED_RESULT_IMAGE_TYPES.has(file.type)) {
      toast.error({
        message: 'Ảnh không hợp lệ',
        description: 'Vui lòng chọn file .jpg, .jpeg, .png hoặc .gif.',
        placement: 'topRight',
      });

      return Upload.LIST_IGNORE;
    }

    if (file.size > MAX_RESULT_IMAGE_SIZE) {
      toast.error({
        message: 'Ảnh quá lớn',
        description: `Dung lượng ảnh tối đa là ${MAX_RESULT_IMAGE_SIZE_MB}MB.`,
        placement: 'topRight',
      });

      return Upload.LIST_IGNORE;
    }

    return false;
  };

  const handleUploadChange = (nextFiles: UploadFile[]) => {
    setCompleteUploadFiles(nextFiles.slice(-1));
  };

  const handleCompleteAppointment = async () => {
    if (!selectedAppointment) {
      return;
    }

    const picture = completeUploadFiles[0]?.originFileObj;

    if (!picture) {
      toast.error({
        message: 'Thiếu ảnh kết quả',
        description: 'Vui lòng chọn ảnh kết quả trước khi hoàn tất lịch hẹn.',
        placement: 'topRight',
      });

      return;
    }

    setMutationLoading(true);

    try {
      const response = await staffAppointmentRoleStaffApi.complete(
        selectedAppointment.appointmentId,
        {
          picture,
        },
      );

      if (!response.success) {
        throw new Error(response.message || 'Không thể hoàn tất lịch hẹn.');
      }

      toast.success({
        message: 'Hoàn tất lịch hẹn thành công',
        description: response.message,
        placement: 'topRight',
      });
      closeCompleteModal();
      await refetch();
    } catch (error) {
      toast.error({
        message: 'Hoàn tất lịch hẹn thất bại',
        description: getApiErrorMessage(error, 'Vui lòng thử lại sau.'),
        placement: 'topRight',
      });
    } finally {
      setMutationLoading(false);
    }
  };

  const columns: ColumnsType<StaffAppointment> = [
    {
      title: 'Khách hàng',
      dataIndex: 'customerName',
      width: 240,
      render: (customerName: string, record) => (
        <Space>
          <Avatar src={getAssetUrl(record.customerAvatar)}>
            {getAvatarInitial(customerName, record.customerPhone)}
          </Avatar>
          <div>
            <Typography.Text strong>{customerName}</Typography.Text>
            <Typography.Text className="block !text-xs !text-slate-500">
              {record.customerPhone || 'Chưa có số điện thoại'}
            </Typography.Text>
          </div>
        </Space>
      ),
    },
    {
      title: 'Dịch vụ',
      dataIndex: 'serviceName',
      render: (serviceName: string, record) => (
        <div>
          <Typography.Text strong>{serviceName}</Typography.Text>
          <Typography.Text className="block !text-xs !text-slate-500">
            Mã lịch: {record.appointmentId} · Số lượng: {record.quantity}
          </Typography.Text>
        </div>
      ),
    },
    {
      title: 'Thời gian',
      dataIndex: 'startTime',
      width: 220,
      render: (startTime: string, record) =>
        formatAppointmentDateTimeRange(startTime, record.endTime),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      width: 140,
      render: (status: string) => {
        const statusMeta = getStaffAppointmentStatusMeta(status);

        return <Tag color={statusMeta.color}>{statusMeta.label}</Tag>;
      },
    },
    {
      title: 'Kết quả',
      dataIndex: 'picture',
      width: 110,
      render: (picture: string | null) =>
        picture ? (
          <Image
            width={54}
            height={42}
            className="rounded object-cover"
            src={getAssetUrl(picture)}
            alt="Kết quả dịch vụ"
          />
        ) : (
          <Typography.Text className="!text-xs !text-slate-500">Chưa có</Typography.Text>
        ),
    },
    {
      title: 'Thao tác',
      key: 'actions',
      fixed: 'right',
      width: 150,
      render: (_, record) => (
        <Space size={8}>
          <Tooltip title="Xem chi tiết">
            <Button icon={<EyeOutlined />} onClick={() => openDetailModal(record)} />
          </Tooltip>
          <Tooltip
            title={
              isCompletableAppointment(record.status)
                ? 'Hoàn tất lịch hẹn'
                : 'Chỉ lịch đã xác nhận mới có thể hoàn tất'
            }
          >
            <Button
              type="primary"
              icon={<CheckCircleOutlined />}
              disabled={!isCompletableAppointment(record.status)}
              onClick={() => openCompleteModal(record)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <>
      {toastContextHolder}

      <DashboardPage
        title="Lịch hẹn của tôi"
        description="Theo dõi lịch hẹn được phân công, lọc theo ngày và hoàn tất lịch bằng ảnh kết quả."
        actions={
          <Button icon={<ReloadOutlined />} loading={loading} onClick={() => void refetch()}>
            Tải lại
          </Button>
        }
      >
        <Card className="staff-dashboard-filter-card">
          <Form<StaffAppointmentFilterFormValues>
            form={filterForm}
            layout="vertical"
            initialValues={filters}
            onFinish={handleSearch}
          >
            <div className="staff-appointment-filter-grid">
              <Form.Item name="keyWord" label="Tìm kiếm" className="!mb-0">
                <Input
                  allowClear
                  placeholder="Mã lịch, khách hàng, số điện thoại hoặc dịch vụ"
                  prefix={<SearchOutlined />}
                />
              </Form.Item>
              <Form.Item name="date" label="Ngày hẹn" className="!mb-0">
                <DatePicker className="w-full" format="DD/MM/YYYY" />
              </Form.Item>
              <Form.Item name="status" label="Trạng thái" className="!mb-0">
                <AppSelect<StaffAppointmentStatus>
                  allowClear
                  options={STAFF_APPOINTMENT_STATUS_OPTIONS}
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

        <DataTable<StaffAppointment>
          rowKey={(record) => `${record.appointmentId}-${record.appointmentDetailId}`}
          dataSource={items}
          loading={loading}
          title="Danh sách lịch hẹn"
          columns={columns}
          locale={{ emptyText: 'Chưa có lịch hẹn nào.' }}
          paginationConfig={{
            current: currentPage,
            onChange: handlePageChange,
            pageSize,
            total,
          }}
        />
      </DashboardPage>

      <Modal
        open={detailModalOpen}
        title="Chi tiết lịch hẹn"
        footer={<Button onClick={closeDetailModal}>Đóng</Button>}
        width={760}
        onCancel={closeDetailModal}
      >
        {selectedAppointment ? (
          <Space direction="vertical" size={18} className="w-full">
            <div className="flex items-center gap-3 rounded-lg bg-slate-50 p-4">
              <Avatar size={48} src={getAssetUrl(selectedAppointment.customerAvatar)}>
                {getAvatarInitial(
                  selectedAppointment.customerName,
                  selectedAppointment.customerPhone,
                )}
              </Avatar>
              <div>
                <Typography.Title level={5} className="!mb-1">
                  {selectedAppointment.customerName}
                </Typography.Title>
                <Typography.Text className="!text-slate-500">
                  {selectedAppointment.customerPhone || 'Chưa có số điện thoại'}
                </Typography.Text>
              </div>
              <Tag
                className="!ml-auto"
                color={getStaffAppointmentStatusMeta(selectedAppointment.status).color}
              >
                {getStaffAppointmentStatusMeta(selectedAppointment.status).label}
              </Tag>
            </div>

            <Descriptions column={2} size="small" bordered>
              <Descriptions.Item label="Mã lịch">
                {selectedAppointment.appointmentId}
              </Descriptions.Item>
              <Descriptions.Item label="Dịch vụ">
                {selectedAppointment.serviceName}
              </Descriptions.Item>
              <Descriptions.Item label="Bắt đầu">
                {formatDateTime(selectedAppointment.startTime)}
              </Descriptions.Item>
              <Descriptions.Item label="Kết thúc">
                {formatDateTime(selectedAppointment.endTime)}
              </Descriptions.Item>
              <Descriptions.Item label="Số lượng">
                {selectedAppointment.quantity}
              </Descriptions.Item>
              <Descriptions.Item label="Mã dịch vụ">
                {selectedAppointment.serviceId}
              </Descriptions.Item>
              <Descriptions.Item label="Ghi chú" span={2}>
                {selectedAppointment.note || 'Không có ghi chú'}
              </Descriptions.Item>
            </Descriptions>

            {selectedAppointment.picture ? (
              <div>
                <Typography.Text strong>Ảnh kết quả</Typography.Text>
                <Image
                  className="mt-3 rounded-lg object-cover"
                  width="100%"
                  height={260}
                  src={getAssetUrl(selectedAppointment.picture)}
                  alt="Ảnh kết quả lịch hẹn"
                />
              </div>
            ) : null}
          </Space>
        ) : null}
      </Modal>

      <Modal
        open={completeModalOpen}
        title="Hoàn tất lịch hẹn"
        okText="Hoàn tất"
        cancelText="Hủy"
        confirmLoading={mutationLoading}
        onCancel={closeCompleteModal}
        onOk={() => void handleCompleteAppointment()}
      >
        {selectedAppointment ? (
          <Space direction="vertical" size={16} className="w-full">
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
              <Typography.Text strong>{selectedAppointment.serviceName}</Typography.Text>
              <Typography.Text className="block !text-sm !text-slate-500">
                {selectedAppointment.customerName} ·{' '}
                {formatAppointmentDateTimeRange(
                  selectedAppointment.startTime,
                  selectedAppointment.endTime,
                )}
              </Typography.Text>
            </div>

            <div>
              <Typography.Text strong>Ảnh kết quả sau dịch vụ</Typography.Text>
              <Typography.Text className="block !text-xs !text-slate-500">
                Hỗ trợ .jpg, .jpeg, .png, .gif và tối đa {MAX_RESULT_IMAGE_SIZE_MB}MB.
              </Typography.Text>
            </div>

            <Upload
              accept=".jpg,.jpeg,.png,.gif"
              beforeUpload={handleBeforeUpload}
              fileList={completeUploadFiles}
              listType="picture"
              maxCount={1}
              onChange={({ fileList }) => handleUploadChange(fileList)}
            >
              <Button icon={<UploadOutlined />}>Chọn ảnh kết quả</Button>
            </Upload>
          </Space>
        ) : null}
      </Modal>
    </>
  );
}
