import {
  EditOutlined,
  EyeOutlined,
  ReloadOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import {
  Avatar,
  Button,
  Card,
  Descriptions,
  Form,
  Image,
  Input,
  Modal,
  Rate,
  Space,
  Tag,
  Tooltip,
  Typography,
  notification,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import { useEffect, useRef, useState } from 'react';

import { DashboardPage } from '@/features/dashboard/components/DashboardPage';
import { AppSelect } from '@/shared/components/AppSelect';
import { DataTable } from '@/shared/components/DataTable';
import { useTable } from '@/shared/hooks/useTable';
import { getApiErrorMessage } from '@/shared/utils/api-error';
import { getAssetUrl } from '@/shared/utils/asset-url';
import { getAvatarInitial } from '@/shared/utils/avatar';

import { adminReviewRoleAdminApi } from '../api/admin-review-api';
import {
  ADMIN_REVIEW_STATUS_OPTIONS,
  getAdminReviewStatusMeta,
} from '../constants/admin-review-options';
import type {
  AdminReview,
  AdminReviewFilterParams,
  UpdateAdminReviewStatusPayload,
} from '../types/admin-review-type';

type ReviewFilterFormValues = Pick<AdminReviewFilterParams, 'keyWord' | 'status'>;

const formatDateTime = (value: string) => {
  const parsedDate = dayjs(value);

  return parsedDate.isValid() ? parsedDate.format('DD/MM/YYYY HH:mm') : value;
};

export function AdminReviewsPage() {
  const [filterForm] = Form.useForm<ReviewFilterFormValues>();
  const [statusForm] = Form.useForm<UpdateAdminReviewStatusPayload>();
  const [toast, toastContextHolder] = notification.useNotification();
  const [detailOpen, setDetailOpen] = useState(false);
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [selectedReview, setSelectedReview] = useState<AdminReview | null>(null);
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
  } = useTable<AdminReview, AdminReviewFilterParams>({
    fetchData: adminReviewRoleAdminApi.getAll,
    initialPageSize: 10,
  });

  useEffect(() => {
    if (!error || lastListErrorRef.current === error) {
      return;
    }

    lastListErrorRef.current = error;
    toast.error({
      message: 'Không thể tải danh sách đánh giá',
      description: error,
      placement: 'topRight',
    });
  }, [error, toast]);

  const openDetailModal = (review: AdminReview) => {
    setSelectedReview(review);
    setDetailOpen(true);
  };

  const closeDetailModal = () => {
    setSelectedReview(null);
    setDetailOpen(false);
  };

  const openStatusModal = (review: AdminReview) => {
    setSelectedReview(review);
    statusForm.setFieldsValue({
      status: review.status as UpdateAdminReviewStatusPayload['status'],
    });
    setStatusModalOpen(true);
  };

  const closeStatusModal = () => {
    setSelectedReview(null);
    statusForm.resetFields();
    setStatusModalOpen(false);
  };

  const handleUpdateStatus = async (values: UpdateAdminReviewStatusPayload) => {
    if (!selectedReview) {
      return;
    }

    setMutationLoading(true);

    try {
      const response = await adminReviewRoleAdminApi.updateStatus(selectedReview.id, values);

      if (!response.success) {
        throw new Error(response.message || 'Không thể cập nhật trạng thái đánh giá.');
      }

      toast.success({
        message: 'Cập nhật trạng thái thành công',
        description: response.message,
        placement: 'topRight',
      });
      closeStatusModal();
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

  const columns: ColumnsType<AdminReview> = [
    {
      title: 'Khách hàng',
      dataIndex: 'customerName',
      render: (customerName: string) => (
        <Space>
          <Avatar>{getAvatarInitial(customerName)}</Avatar>
          <Typography.Text strong>{customerName || 'Chưa cập nhật'}</Typography.Text>
        </Space>
      ),
    },
    {
      title: 'Ảnh',
      dataIndex: 'picture',
      width: 96,
      render: (picture: string) =>
        picture ? (
          <Image
            className="rounded object-cover"
            height={56}
            src={getAssetUrl(picture)}
            width={56}
          />
        ) : (
          'Không có'
        ),
    },
    {
      title: 'Nội dung',
      dataIndex: 'description',
      ellipsis: true,
    },
    {
      title: 'Điểm',
      dataIndex: 'serviceScore',
      width: 150,
      render: (score: number) => <Rate allowHalf disabled value={score} />,
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createAt',
      width: 160,
      render: formatDateTime,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      width: 128,
      render: (status: string) => {
        const statusMeta = getAdminReviewStatusMeta(status);

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
          <Tooltip title="Xem chi tiết đánh giá">
            <Button
              aria-label="Xem chi tiết đánh giá"
              icon={<EyeOutlined />}
              onClick={() => openDetailModal(record)}
            />
          </Tooltip>
          <Tooltip title="Cập nhật trạng thái">
            <Button
              aria-label="Cập nhật trạng thái đánh giá"
              icon={<EditOutlined />}
              onClick={() => openStatusModal(record)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  const handleSearch = (values: ReviewFilterFormValues) => {
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
        title="Quản lý đánh giá"
        description="Kiểm duyệt đánh giá dịch vụ và phản hồi từ khách hàng."
        actions={
          <Button icon={<ReloadOutlined />} loading={loading} onClick={() => void refetch()}>
            Tải lại
          </Button>
        }
      >
        <Card>
          <Form<ReviewFilterFormValues>
            form={filterForm}
            layout="vertical"
            initialValues={filters}
            onFinish={handleSearch}
          >
            <div className="grid gap-3 md:grid-cols-[1fr_220px_auto] md:items-end">
              <Form.Item name="keyWord" label="Tìm kiếm" className="!mb-0">
                <Input allowClear placeholder="Tên khách hàng hoặc nội dung" prefix={<SearchOutlined />} />
              </Form.Item>
              <Form.Item name="status" label="Trạng thái" className="!mb-0">
                <AppSelect
                  allowClear
                  options={ADMIN_REVIEW_STATUS_OPTIONS}
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

        <DataTable<AdminReview>
          rowKey="id"
          dataSource={items}
          loading={loading}
          title="Danh sách đánh giá"
          columns={columns}
          locale={{
            emptyText: 'Chưa có đánh giá nào.',
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
        width={720}
        open={detailOpen}
        title="Chi tiết đánh giá"
        footer={null}
        onCancel={closeDetailModal}
      >
        {selectedReview ? (
          <Space direction="vertical" size={16} className="w-full">
            {selectedReview.picture ? (
              <Image
                className="max-h-[320px] rounded object-cover"
                src={getAssetUrl(selectedReview.picture)}
                width="100%"
              />
            ) : null}
            <Descriptions column={1} bordered size="small">
              <Descriptions.Item label="Khách hàng">{selectedReview.customerName}</Descriptions.Item>
              <Descriptions.Item label="Điểm dịch vụ">
                <Rate allowHalf disabled value={selectedReview.serviceScore} />
              </Descriptions.Item>
              <Descriptions.Item label="Trạng thái">
                <Tag color={getAdminReviewStatusMeta(selectedReview.status).color}>
                  {getAdminReviewStatusMeta(selectedReview.status).label}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Ngày tạo">
                {formatDateTime(selectedReview.createAt)}
              </Descriptions.Item>
              <Descriptions.Item label="Nội dung">{selectedReview.description}</Descriptions.Item>
            </Descriptions>
          </Space>
        ) : null}
      </Modal>

      <Modal
        open={statusModalOpen}
        title="Cập nhật trạng thái đánh giá"
        okText="Lưu thay đổi"
        cancelText="Hủy"
        confirmLoading={mutationLoading}
        onCancel={closeStatusModal}
        onOk={() => void statusForm.submit()}
      >
        <div className="mb-5">
          <Typography.Text strong>{selectedReview?.customerName || 'Đánh giá'}</Typography.Text>
          <div className="text-sm text-slate-500">{selectedReview?.description}</div>
        </div>

        <Form<UpdateAdminReviewStatusPayload>
          form={statusForm}
          layout="vertical"
          onFinish={handleUpdateStatus}
        >
          <Form.Item
            name="status"
            label="Trạng thái"
            rules={[{ required: true, message: 'Vui lòng chọn trạng thái.' }]}
          >
            <AppSelect options={ADMIN_REVIEW_STATUS_OPTIONS} placeholder="Chọn trạng thái" />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}
