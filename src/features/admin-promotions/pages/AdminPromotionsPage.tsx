import {
  EditOutlined,
  EyeOutlined,
  PlusOutlined,
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
  InputNumber,
  Modal,
  Space,
  Tag,
  Tooltip,
  Typography,
  Upload,
  notification,
} from 'antd';
import type { UploadFile } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import type { Dayjs } from 'dayjs';
import { useEffect, useRef, useState } from 'react';

import { DashboardPage } from '@/features/dashboard/components/DashboardPage';
import { AppSelect } from '@/shared/components/AppSelect';
import { DataTable } from '@/shared/components/DataTable';
import { useTable } from '@/shared/hooks/useTable';
import { getApiErrorMessage } from '@/shared/utils/api-error';
import { getAssetUrl } from '@/shared/utils/asset-url';

import { adminPromotionRoleAdminApi } from '../api/admin-promotion-api';
import {
  ADMIN_PROMOTION_DISCOUNT_TYPE_OPTIONS,
  ADMIN_PROMOTION_STATUS_OPTIONS,
  formatAdminPromotionDiscount,
  getAdminPromotionDiscountTypeLabel,
  getAdminPromotionStatusMeta,
} from '../constants/admin-promotion-options';
import type {
  AdminPromotion,
  AdminPromotionFilterFormValues,
  AdminPromotionFilterParams,
  AdminPromotionFormValues,
  CreateAdminPromotionPayload,
  UpdateAdminPromotionPayload,
} from '../types/admin-promotion-type';

type PromotionModalMode = 'create' | 'update';

const toUploadFile = (files?: UploadFile[]) => files?.[0]?.originFileObj;

const formatDate = (value: string) => {
  const parsedDate = dayjs(value);

  return parsedDate.isValid() ? parsedDate.format('DD/MM/YYYY') : value;
};

const toCreatePayload = (values: AdminPromotionFormValues): CreateAdminPromotionPayload => ({
  description: values.description.trim(),
  discountAmount: values.discountAmount,
  discountType: values.discountType,
  endDate: values.endDate.format('YYYY-MM-DD'),
  image: toUploadFile(values.image),
  promotionCode: values.promotionCode.trim(),
  startDate: values.startDate.format('YYYY-MM-DD'),
});

const toUpdatePayload = (values: AdminPromotionFormValues): UpdateAdminPromotionPayload => ({
  ...toCreatePayload(values),
  status: values.status ?? 'ACTIVE',
});

export function AdminPromotionsPage() {
  const [filterForm] = Form.useForm<AdminPromotionFilterFormValues>();
  const [promotionForm] = Form.useForm<AdminPromotionFormValues>();
  const [toast, toastContextHolder] = notification.useNotification();
  const [modalMode, setModalMode] = useState<PromotionModalMode>('create');
  const [modalOpen, setModalOpen] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const [selectedPromotion, setSelectedPromotion] = useState<AdminPromotion | null>(null);
  const [mutationLoading, setMutationLoading] = useState(false);
  const [uploadFiles, setUploadFiles] = useState<UploadFile[]>([]);
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
  } = useTable<AdminPromotion, AdminPromotionFilterParams>({
    fetchData: adminPromotionRoleAdminApi.getAll,
    initialPageSize: 10,
  });

  useEffect(() => {
    if (!error || lastListErrorRef.current === error) {
      return;
    }

    lastListErrorRef.current = error;
    toast.error({
      message: 'Không thể tải danh sách khuyến mãi',
      description: error,
      placement: 'topRight',
    });
  }, [error, toast]);

  const resetUploadState = () => {
    setUploadFiles([]);
    promotionForm.setFieldValue('image', undefined);
  };

  const openCreateModal = () => {
    setModalMode('create');
    setSelectedPromotion(null);
    promotionForm.resetFields();
    resetUploadState();
    setModalOpen(true);
  };

  const openUpdateModal = (promotion: AdminPromotion) => {
    setModalMode('update');
    setSelectedPromotion(promotion);
    resetUploadState();
    promotionForm.setFieldsValue({
      description: promotion.description,
      discountAmount: promotion.discountAmount,
      discountType: promotion.discountType as AdminPromotionFormValues['discountType'],
      endDate: dayjs(promotion.endDate),
      promotionCode: promotion.promotionCode,
      startDate: dayjs(promotion.startDate),
      status: promotion.status as AdminPromotionFormValues['status'],
    });
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedPromotion(null);
    promotionForm.resetFields();
    resetUploadState();
  };

  const openDetailModal = (promotion: AdminPromotion) => {
    setSelectedPromotion(promotion);
    setDetailOpen(true);
  };

  const closeDetailModal = () => {
    setSelectedPromotion(null);
    setDetailOpen(false);
  };

  const handleSubmitPromotion = async (values: AdminPromotionFormValues) => {
    setMutationLoading(true);

    try {
      const response =
        modalMode === 'create'
          ? await adminPromotionRoleAdminApi.create(toCreatePayload(values))
          : await adminPromotionRoleAdminApi.update(selectedPromotion!.id, toUpdatePayload(values));

      if (!response.success) {
        throw new Error(response.message || 'Không thể lưu khuyến mãi.');
      }

      toast.success({
        message: modalMode === 'create' ? 'Tạo khuyến mãi thành công' : 'Cập nhật khuyến mãi thành công',
        description: response.message,
        placement: 'topRight',
      });
      closeModal();
      await refetch();
    } catch (submitError) {
      toast.error({
        message: modalMode === 'create' ? 'Tạo khuyến mãi thất bại' : 'Cập nhật khuyến mãi thất bại',
        description: getApiErrorMessage(submitError, 'Vui lòng thử lại sau.'),
        placement: 'topRight',
      });
    } finally {
      setMutationLoading(false);
    }
  };

  const columns: ColumnsType<AdminPromotion> = [
    {
      title: 'Mã khuyến mãi',
      dataIndex: 'promotionCode',
      render: (promotionCode: string, record) => (
        <Space>
          <Avatar shape="square" size={48} src={getAssetUrl(record.image)}>
            {promotionCode?.charAt(0)}
          </Avatar>
          <div>
            <Typography.Text strong>{promotionCode}</Typography.Text>
            <div className="max-w-[260px] truncate text-xs text-slate-500">{record.description}</div>
          </div>
        </Space>
      ),
    },
    {
      title: 'Giảm giá',
      key: 'discount',
      width: 160,
      render: (_, record) => formatAdminPromotionDiscount(record.discountAmount, record.discountType),
    },
    {
      title: 'Loại',
      dataIndex: 'discountType',
      width: 150,
      render: getAdminPromotionDiscountTypeLabel,
    },
    {
      title: 'Hiệu lực',
      key: 'dateRange',
      width: 210,
      render: (_, record) => `${formatDate(record.startDate)} - ${formatDate(record.endDate)}`,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      width: 140,
      render: (status: string) => {
        const statusMeta = getAdminPromotionStatusMeta(status);

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
              aria-label="Xem chi tiết khuyến mãi"
              icon={<EyeOutlined />}
              onClick={() => openDetailModal(record)}
            />
          </Tooltip>
          <Tooltip title="Cập nhật khuyến mãi">
            <Button
              aria-label="Cập nhật khuyến mãi"
              icon={<EditOutlined />}
              onClick={() => openUpdateModal(record)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  const handleSearch = (values: AdminPromotionFilterFormValues) => {
    handleFilterChange({
      discountType: values.discountType,
      fromDate: values.dateRange?.[0]?.format('YYYY-MM-DD'),
      keyword: values.keyword?.trim() || undefined,
      status: values.status,
      toDate: values.dateRange?.[1]?.format('YYYY-MM-DD'),
    });
  };

  const handleReset = () => {
    filterForm.resetFields();
    resetFilters();
  };

  const handleUploadChange = (nextFiles: UploadFile[]) => {
    setUploadFiles(nextFiles);
    promotionForm.setFieldValue('image', nextFiles);
  };

  return (
    <>
      {toastContextHolder}

      <DashboardPage
        title="Quản lý khuyến mãi"
        description="Theo dõi mã ưu đãi, thời hạn và trạng thái áp dụng."
        actions={
          <Space>
            <Button icon={<ReloadOutlined />} loading={loading} onClick={() => void refetch()}>
              Tải lại
            </Button>
            <Button type="primary" icon={<PlusOutlined />} onClick={openCreateModal}>
              Thêm khuyến mãi
            </Button>
          </Space>
        }
      >
        <Card>
          <Form<AdminPromotionFilterFormValues>
            form={filterForm}
            layout="vertical"
            initialValues={filters}
            onFinish={handleSearch}
          >
            <div className="grid gap-3 xl:grid-cols-[1fr_180px_190px_260px_auto] xl:items-end">
              <Form.Item name="keyword" label="Tìm kiếm" className="!mb-0">
                <Input allowClear placeholder="Mã hoặc mô tả khuyến mãi" prefix={<SearchOutlined />} />
              </Form.Item>
              <Form.Item name="status" label="Trạng thái" className="!mb-0">
                <AppSelect
                  allowClear
                  options={ADMIN_PROMOTION_STATUS_OPTIONS}
                  placeholder="Tất cả"
                />
              </Form.Item>
              <Form.Item name="discountType" label="Loại giảm" className="!mb-0">
                <AppSelect
                  allowClear
                  options={ADMIN_PROMOTION_DISCOUNT_TYPE_OPTIONS}
                  placeholder="Tất cả"
                />
              </Form.Item>
              <Form.Item name="dateRange" label="Khoảng ngày" className="!mb-0">
                <DatePicker.RangePicker className="w-full" format="DD/MM/YYYY" />
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

        <DataTable<AdminPromotion>
          rowKey="id"
          dataSource={items}
          loading={loading}
          title="Danh sách khuyến mãi"
          columns={columns}
          locale={{
            emptyText: 'Chưa có khuyến mãi nào.',
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
        width={760}
        open={modalOpen}
        title={modalMode === 'create' ? 'Thêm khuyến mãi' : 'Cập nhật khuyến mãi'}
        okText={modalMode === 'create' ? 'Tạo khuyến mãi' : 'Lưu thay đổi'}
        cancelText="Hủy"
        confirmLoading={mutationLoading}
        onCancel={closeModal}
        onOk={() => void promotionForm.submit()}
      >
        <Form<AdminPromotionFormValues>
          form={promotionForm}
          layout="vertical"
          onFinish={handleSubmitPromotion}
        >
          <Form.Item
            name="promotionCode"
            label="Mã khuyến mãi"
            rules={[
              { required: true, message: 'Vui lòng nhập mã khuyến mãi.' },
              {
                max: modalMode === 'create' ? 13 : 20,
                message:
                  modalMode === 'create'
                    ? 'Mã khuyến mãi không vượt quá 13 ký tự.'
                    : 'Mã khuyến mãi không vượt quá 20 ký tự.',
              },
              {
                min: modalMode === 'create' ? 6 : 5,
                message:
                  modalMode === 'create'
                    ? 'Mã khuyến mãi tối thiểu 6 ký tự.'
                    : 'Mã khuyến mãi tối thiểu 5 ký tự.',
              },
            ]}
          >
            <Input
              placeholder="Nhập mã khuyến mãi"
              maxLength={modalMode === 'create' ? 13 : 20}
            />
          </Form.Item>
          <Form.Item
            name="description"
            label="Mô tả"
            rules={[{ required: true, message: 'Vui lòng nhập mô tả.' }]}
          >
            <Input.TextArea placeholder="Nhập mô tả khuyến mãi" rows={4} />
          </Form.Item>
          <div className="grid gap-4 md:grid-cols-2">
            <Form.Item
              name="discountAmount"
              label="Giá trị giảm"
              rules={[
                { required: true, message: 'Vui lòng nhập giá trị giảm.' },
                { type: 'number', min: 0.01, message: 'Giá trị giảm phải lớn hơn 0.' },
              ]}
            >
              <InputNumber className="!w-full" min={0.01} />
            </Form.Item>
            <Form.Item
              name="discountType"
              label="Loại giảm"
              rules={[{ required: true, message: 'Vui lòng chọn loại giảm.' }]}
            >
              <AppSelect options={ADMIN_PROMOTION_DISCOUNT_TYPE_OPTIONS} placeholder="Chọn loại giảm" />
            </Form.Item>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <Form.Item
              name="startDate"
              label="Ngày bắt đầu"
              rules={[{ required: true, message: 'Vui lòng chọn ngày bắt đầu.' }]}
            >
              <DatePicker className="w-full" format="DD/MM/YYYY" />
            </Form.Item>
            <Form.Item
              name="endDate"
              label="Ngày kết thúc"
              dependencies={['startDate']}
              rules={[
                { required: true, message: 'Vui lòng chọn ngày kết thúc.' },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    const startDate = getFieldValue('startDate') as Dayjs | undefined;

                    if (!value || !startDate || value.isSame(startDate, 'day') || value.isAfter(startDate, 'day')) {
                      return Promise.resolve();
                    }

                    return Promise.reject(new Error('Ngày kết thúc phải sau hoặc bằng ngày bắt đầu.'));
                  },
                }),
              ]}
            >
              <DatePicker className="w-full" format="DD/MM/YYYY" />
            </Form.Item>
          </div>
          {modalMode === 'update' ? (
            <Form.Item
              name="status"
              label="Trạng thái"
              rules={[{ required: true, message: 'Vui lòng chọn trạng thái.' }]}
            >
              <AppSelect options={ADMIN_PROMOTION_STATUS_OPTIONS} placeholder="Chọn trạng thái" />
            </Form.Item>
          ) : null}
          <Form.Item name="image" label="Hình ảnh">
            <Upload
              accept="image/*"
              beforeUpload={() => false}
              fileList={uploadFiles}
              listType="picture"
              maxCount={1}
              onChange={({ fileList }) => handleUploadChange(fileList)}
            >
              <Button icon={<UploadOutlined />}>Chọn hình</Button>
            </Upload>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        width={760}
        open={detailOpen}
        title="Chi tiết khuyến mãi"
        footer={null}
        onCancel={closeDetailModal}
      >
        {selectedPromotion ? (
          <Space direction="vertical" size={16} className="w-full">
            {selectedPromotion.image ? (
              <Image
                className="max-h-[320px] rounded object-cover"
                src={getAssetUrl(selectedPromotion.image)}
                width="100%"
              />
            ) : null}
            <Descriptions column={1} bordered size="small">
              <Descriptions.Item label="Mã khuyến mãi">
                {selectedPromotion.promotionCode}
              </Descriptions.Item>
              <Descriptions.Item label="Mô tả">{selectedPromotion.description}</Descriptions.Item>
              <Descriptions.Item label="Giảm giá">
                {formatAdminPromotionDiscount(
                  selectedPromotion.discountAmount,
                  selectedPromotion.discountType,
                )}
              </Descriptions.Item>
              <Descriptions.Item label="Loại giảm">
                {getAdminPromotionDiscountTypeLabel(selectedPromotion.discountType)}
              </Descriptions.Item>
              <Descriptions.Item label="Hiệu lực">
                {formatDate(selectedPromotion.startDate)} - {formatDate(selectedPromotion.endDate)}
              </Descriptions.Item>
              <Descriptions.Item label="Trạng thái">
                <Tag color={getAdminPromotionStatusMeta(selectedPromotion.status).color}>
                  {getAdminPromotionStatusMeta(selectedPromotion.status).label}
                </Tag>
              </Descriptions.Item>
            </Descriptions>
          </Space>
        ) : null}
      </Modal>
    </>
  );
}
