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
  Descriptions,
  Form,
  Image,
  Input,
  InputNumber,
  Modal,
  Radio,
  Select,
  Space,
  Tag,
  Tooltip,
  Typography,
  Upload,
  notification,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import type { UploadFile } from 'antd';
import { useEffect, useMemo, useRef, useState } from 'react';

import { DashboardPage } from '@/features/dashboard/components/DashboardPage';
import { DataTable } from '@/shared/components/DataTable';
import { useTable } from '@/shared/hooks/useTable';
import { getApiErrorMessage } from '@/shared/utils/api-error';
import { getAssetUrl } from '@/shared/utils/asset-url';

import { adminServiceRoleAdminApi, publicCategoryApi } from '../api/admin-service-api';
import {
  ADMIN_SERVICE_STATUS_OPTIONS,
  getAdminServiceStatusMeta,
} from '../constants/admin-service-options';
import type {
  AdminService,
  AdminServiceFilterParams,
  AdminServiceFormValues,
  PublicCategoryOption,
} from '../types/admin-service-type';

type ServiceModalMode = 'create' | 'update';
type ServiceFilterFormValues = Pick<AdminServiceFilterParams, 'keyword' | 'status'>;

const currencyFormatter = new Intl.NumberFormat('vi-VN', {
  currency: 'VND',
  style: 'currency',
});

const getMainImage = (service: AdminService) =>
  getAssetUrl(
    service.serviceImageList.find((image) => image.isMainImage)?.picture ??
      service.serviceImageList[0]?.picture,
  );

const toUploadFiles = (files?: UploadFile[]) =>
  files
    ?.map((file) => file.originFileObj)
    .filter((file): file is NonNullable<UploadFile['originFileObj']> => Boolean(file)) ?? [];

const reorderFilesByMainImage = (files: UploadFile[], selectedMainUid?: string) => {
  if (!selectedMainUid) {
    return files;
  }

  const mainFileIndex = files.findIndex((file) => file.uid === selectedMainUid);

  if (mainFileIndex <= 0) {
    return files;
  }

  const nextFiles = [...files];
  const [mainFile] = nextFiles.splice(mainFileIndex, 1);

  return [mainFile, ...nextFiles];
};

export function AdminServicesPage() {
  const [filterForm] = Form.useForm<ServiceFilterFormValues>();
  const [serviceForm] = Form.useForm<AdminServiceFormValues>();
  const [toast, toastContextHolder] = notification.useNotification();
  const [modalMode, setModalMode] = useState<ServiceModalMode>('create');
  const [modalOpen, setModalOpen] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<AdminService | null>(null);
  const [mutationLoading, setMutationLoading] = useState(false);
  const [categoryOptions, setCategoryOptions] = useState<PublicCategoryOption[]>([]);
  const [categoryLoading, setCategoryLoading] = useState(false);
  const [uploadFiles, setUploadFiles] = useState<UploadFile[]>([]);
  const [mainImageUid, setMainImageUid] = useState<string | undefined>();
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
  } = useTable<AdminService, AdminServiceFilterParams>({
    fetchData: adminServiceRoleAdminApi.getAll,
    initialPageSize: 5,
  });

  const createCategoryOptions = useMemo(
    () => categoryOptions.map((category) => ({ label: category.name, value: category.id })),
    [categoryOptions],
  );

  const updateCategoryOptions = useMemo(
    () => categoryOptions.map((category) => ({ label: category.name, value: category.name })),
    [categoryOptions],
  );

  useEffect(() => {
    if (!error || lastListErrorRef.current === error) {
      return;
    }

    lastListErrorRef.current = error;
    toast.error({
      message: 'Không thể tải dịch vụ',
      description: error,
      placement: 'topRight',
    });
  }, [error, toast]);

  const fetchCategoryOptions = async () => {
    setCategoryLoading(true);

    try {
      const response = await publicCategoryApi.getOptions();

      if (!response.success) {
        throw new Error(response.message || 'Không thể tải danh mục.');
      }

      setCategoryOptions(response.data);
    } catch (fetchError) {
      toast.error({
        message: 'Không thể tải danh mục',
        description: getApiErrorMessage(fetchError, 'Vui lòng thử lại sau.'),
        placement: 'topRight',
      });
    } finally {
      setCategoryLoading(false);
    }
  };

  const resetUploadState = () => {
    setUploadFiles([]);
    setMainImageUid(undefined);
    serviceForm.setFieldValue('mainImageUid', undefined);
  };

  const openCreateModal = () => {
    setModalMode('create');
    setSelectedService(null);
    serviceForm.resetFields();
    resetUploadState();
    setModalOpen(true);
    void fetchCategoryOptions();
  };

  const openUpdateModal = (service: AdminService) => {
    setModalMode('update');
    setSelectedService(service);
    resetUploadState();
    serviceForm.setFieldsValue({
      categoryValue: service.categoryName,
      description: service.description,
      durationMinutes: service.durationMinutes,
      name: service.name,
      price: service.price,
      status: service.status.toUpperCase() === 'ACTIVE' ? 'ACTIVE' : 'INACTIVE',
    });
    setModalOpen(true);
    void fetchCategoryOptions();
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedService(null);
    serviceForm.resetFields();
    resetUploadState();
  };

  const openDetailModal = (service: AdminService) => {
    setSelectedService(service);
    setDetailOpen(true);
  };

  const closeDetailModal = () => {
    setDetailOpen(false);
    setSelectedService(null);
  };

  const handleUploadChange = (nextFiles: UploadFile[]) => {
    setUploadFiles(nextFiles);
    serviceForm.setFieldValue('images', nextFiles);

    if (!nextFiles.length) {
      setMainImageUid(undefined);
      serviceForm.setFieldValue('mainImageUid', undefined);
      return;
    }

    if (!mainImageUid || !nextFiles.some((file) => file.uid === mainImageUid)) {
      setMainImageUid(nextFiles[0].uid);
      serviceForm.setFieldValue('mainImageUid', nextFiles[0].uid);
    }
  };

  const handleSubmitService = async (values: AdminServiceFormValues) => {
    const images = toUploadFiles(reorderFilesByMainImage(uploadFiles, mainImageUid));

    setMutationLoading(true);

    try {
      const response =
        modalMode === 'create'
          ? await adminServiceRoleAdminApi.create({
              categoryId: values.categoryValue,
              description: values.description,
              durationMinutes: values.durationMinutes,
              images,
              name: values.name,
              price: values.price,
            })
          : await adminServiceRoleAdminApi.update(selectedService!.id, {
              categoryName: values.categoryValue,
              description: values.description,
              durationMinutes: values.durationMinutes,
              images,
              name: values.name,
              price: values.price,
              status: values.status ?? 'ACTIVE',
            });

      if (!response.success) {
        throw new Error(response.message || 'Không thể lưu dịch vụ.');
      }

      toast.success({
        message: modalMode === 'create' ? 'Tạo dịch vụ thành công' : 'Cập nhật dịch vụ thành công',
        description: response.message,
        placement: 'topRight',
      });
      closeModal();
      await refetch();
    } catch (submitError) {
      toast.error({
        message: modalMode === 'create' ? 'Tạo dịch vụ thất bại' : 'Cập nhật dịch vụ thất bại',
        description: getApiErrorMessage(submitError, 'Vui lòng thử lại sau.'),
        placement: 'topRight',
      });
    } finally {
      setMutationLoading(false);
    }
  };

  const columns: ColumnsType<AdminService> = [
    {
      title: 'Dịch vụ',
      dataIndex: 'name',
      render: (_, record) => (
        <Space>
          <Avatar shape="square" size={56} src={getMainImage(record) || undefined}>
            {record.name.charAt(0).toUpperCase()}
          </Avatar>
          <div>
            <Typography.Text strong>{record.name}</Typography.Text>
            <div className="text-xs text-slate-500">{record.categoryName}</div>
          </div>
        </Space>
      ),
    },
    {
      title: 'Thời lượng',
      dataIndex: 'durationMinutes',
      width: 120,
      render: (duration: number) => `${duration} phút`,
    },
    {
      title: 'Giá',
      dataIndex: 'price',
      width: 140,
      render: (price: number) => currencyFormatter.format(price),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      width: 150,
      render: (status: string) => {
        const statusMeta = getAdminServiceStatusMeta(status);

        return <Tag color={statusMeta.color}>{statusMeta.label}</Tag>;
      },
    },
    {
      title: 'Thao tác',
      key: 'actions',
      fixed: 'right',
      width: 112,
      render: (_, record) => (
        <Space>
          <Tooltip title="Chi tiết dịch vụ">
            <Button
              aria-label="Chi tiết dịch vụ"
              icon={<EyeOutlined />}
              onClick={() => openDetailModal(record)}
            />
          </Tooltip>
          <Tooltip title="Cập nhật dịch vụ">
            <Button
              aria-label="Cập nhật dịch vụ"
              icon={<EditOutlined />}
              onClick={() => openUpdateModal(record)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  const handleSearch = (values: ServiceFilterFormValues) => {
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
        title="Quản lí dịch vụ"
        description="Quản lý dịch vụ, giá, thời lượng, hình ảnh và trạng thái hiển thị."
        actions={
          <Space>
            <Button icon={<ReloadOutlined />} loading={loading} onClick={() => void refetch()}>
              Tải lại
            </Button>
            <Button type="primary" icon={<PlusOutlined />} onClick={openCreateModal}>
              Thêm dịch vụ
            </Button>
          </Space>
        }
      >
        <Card>
          <Form<ServiceFilterFormValues>
            form={filterForm}
            layout="vertical"
            initialValues={filters}
            onFinish={handleSearch}
          >
            <div className="flex flex-col gap-3 md:flex-row md:items-end">
              <Form.Item name="keyword" label="Tìm kiếm" className="!mb-0 flex-1">
                <Input allowClear placeholder="Tên hoặc mô tả dịch vụ" prefix={<SearchOutlined />} />
              </Form.Item>
              <Form.Item name="status" label="Trạng thái" className="!mb-0 md:w-[220px]">
                <Select
                  allowClear
                  options={ADMIN_SERVICE_STATUS_OPTIONS}
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

        <DataTable<AdminService>
          rowKey="id"
          dataSource={items}
          loading={loading}
          title="Danh sách dịch vụ"
          columns={columns}
          locale={{
            emptyText: 'Chưa có dịch vụ nào.',
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
        title={modalMode === 'create' ? 'Thêm dịch vụ' : 'Cập nhật dịch vụ'}
        okText={modalMode === 'create' ? 'Tạo dịch vụ' : 'Lưu thay đổi'}
        cancelText="Hủy"
        confirmLoading={mutationLoading}
        onCancel={closeModal}
        onOk={() => void serviceForm.submit()}
      >
        <Form<AdminServiceFormValues>
          form={serviceForm}
          layout="vertical"
          onFinish={handleSubmitService}
        >
          <Form.Item
            name="name"
            label="Tên dịch vụ"
            rules={[
              { required: true, message: 'Vui lòng nhập tên dịch vụ.' },
              { max: 100, message: 'Tên dịch vụ không vượt quá 100 ký tự.' },
            ]}
          >
            <Input placeholder="Nhập tên dịch vụ" maxLength={100} />
          </Form.Item>
          <Form.Item
            name="description"
            label="Mô tả"
            rules={[{ required: true, message: 'Vui lòng nhập mô tả.' }]}
          >
            <Input.TextArea placeholder="Nhập mô tả dịch vụ" rows={4} />
          </Form.Item>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Form.Item
              name="durationMinutes"
              label="Thời lượng"
              rules={[
                { required: true, message: 'Vui lòng nhập thời lượng.' },
                { type: 'number', min: 5, message: 'Thời lượng tối thiểu 5 phút.' },
                { type: 'number', max: 480, message: 'Thời lượng tối đa 480 phút.' },
              ]}
            >
              <InputNumber className="!w-full" min={5} max={480} addonAfter="phút" />
            </Form.Item>
            <Form.Item
              name="price"
              label="Giá"
              rules={[
                { required: true, message: 'Vui lòng nhập giá.' },
                { type: 'number', min: 0, message: 'Giá không được âm.' },
              ]}
            >
              <InputNumber className="!w-full" min={0} addonAfter="VND" />
            </Form.Item>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Form.Item
              name="categoryValue"
              label="Danh mục"
              rules={[{ required: true, message: 'Vui lòng chọn danh mục.' }]}
            >
              <Select
                loading={categoryLoading}
                options={modalMode === 'create' ? createCategoryOptions : updateCategoryOptions}
                placeholder="Chọn danh mục"
                showSearch
                optionFilterProp="label"
              />
            </Form.Item>
            {modalMode === 'update' ? (
              <Form.Item
                name="status"
                label="Trạng thái"
                rules={[{ required: true, message: 'Vui lòng chọn trạng thái.' }]}
              >
                <Select options={ADMIN_SERVICE_STATUS_OPTIONS} placeholder="Chọn trạng thái" />
              </Form.Item>
            ) : null}
          </div>
          <Form.Item name="images" label="Hình ảnh">
            <Upload
              accept="image/*"
              beforeUpload={() => false}
              fileList={uploadFiles}
              listType="picture"
              maxCount={5}
              multiple
              onChange={({ fileList }) => handleUploadChange(fileList)}
            >
              <Button icon={<UploadOutlined />}>Chọn hình</Button>
            </Upload>
          </Form.Item>
          {uploadFiles.length ? (
            <Form.Item name="mainImageUid" label="Ảnh chính">
              <Radio.Group
                className="grid gap-2"
                value={mainImageUid}
                onChange={(event) => {
                  setMainImageUid(event.target.value);
                  serviceForm.setFieldValue('mainImageUid', event.target.value);
                }}
              >
                {uploadFiles.map((file, index) => (
                  <Radio key={file.uid} value={file.uid}>
                    {`Ảnh ${index + 1}: ${file.name}`}
                  </Radio>
                ))}
              </Radio.Group>
            </Form.Item>
          ) : null}
        </Form>
      </Modal>

      <Modal
        width={780}
        open={detailOpen}
        title="Chi tiết dịch vụ"
        footer={null}
        onCancel={closeDetailModal}
      >
        {selectedService ? (
          <Space direction="vertical" size={18} className="w-full">
            {getMainImage(selectedService) ? (
              <Image
                className="max-h-[320px] rounded object-cover"
                src={getMainImage(selectedService)}
                width="100%"
              />
            ) : null}
            <Descriptions column={1} bordered size="small">
              <Descriptions.Item label="Tên dịch vụ">{selectedService.name}</Descriptions.Item>
              <Descriptions.Item label="Danh mục">{selectedService.categoryName}</Descriptions.Item>
              <Descriptions.Item label="Thời lượng">
                {selectedService.durationMinutes} phút
              </Descriptions.Item>
              <Descriptions.Item label="Giá">
                {currencyFormatter.format(selectedService.price)}
              </Descriptions.Item>
              <Descriptions.Item label="Trạng thái">
                <Tag color={getAdminServiceStatusMeta(selectedService.status).color}>
                  {getAdminServiceStatusMeta(selectedService.status).label}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Mô tả">{selectedService.description}</Descriptions.Item>
            </Descriptions>
            {selectedService.serviceImageList.length ? (
              <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                {selectedService.serviceImageList.map((image, index) => (
                  <div key={`${image.picture}-${index}`} className="relative">
                    <Image
                      className="aspect-square rounded object-cover"
                      src={getAssetUrl(image.picture)}
                    />
                    {image.isMainImage ? (
                      <Tag color="green" className="!absolute !left-2 !top-2">
                        Ảnh chính
                      </Tag>
                    ) : null}
                  </div>
                ))}
              </div>
            ) : null}
          </Space>
        ) : null}
      </Modal>
    </>
  );
}
