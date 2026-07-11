import {
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  ReloadOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import {
  Button,
  Card,
  Form,
  Input,
  Modal,
  Popconfirm,
  Space,
  Tag,
  Tooltip,
  notification,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useEffect, useRef, useState } from 'react';

import { DashboardPage } from '@/features/dashboard/components/DashboardPage';
import { DataTable } from '@/shared/components/DataTable';
import { useTable } from '@/shared/hooks/useTable';
import { getApiErrorMessage } from '@/shared/utils/api-error';

import { adminCategoryRoleAdminApi } from '../api/admin-category-api';
import { CategoryColorPicker } from '../components/CategoryColorPicker';
import { DEFAULT_ADMIN_CATEGORY_TAG_COLOR } from '../constants/admin-category-colors';
import type {
  AdminCategory,
  AdminCategoryFilterParams,
  AdminCategoryPayload,
} from '../types/admin-category-type';

type CategoryModalMode = 'create' | 'update';
type CategoryFilterFormValues = Pick<AdminCategoryFilterParams, 'keyword'>;

const HEX_COLOR_PATTERN = /^#[0-9A-Fa-f]{6}$/;

const normalizeCategoryTagColor = (tagColor?: string) => {
  const candidate = tagColor ?? '';

  return HEX_COLOR_PATTERN.test(candidate) ? candidate : DEFAULT_ADMIN_CATEGORY_TAG_COLOR;
};

const getReadableTagTextColor = (tagColor: string) => {
  const colorValue = normalizeCategoryTagColor(tagColor).replace('#', '');
  const red = Number.parseInt(colorValue.slice(0, 2), 16);
  const green = Number.parseInt(colorValue.slice(2, 4), 16);
  const blue = Number.parseInt(colorValue.slice(4, 6), 16);
  const brightness = (red * 299 + green * 587 + blue * 114) / 1000;

  return brightness > 150 ? '#111827' : '#FFFFFF';
};

export function AdminCategoriesPage() {
  const [filterForm] = Form.useForm<CategoryFilterFormValues>();
  const [categoryForm] = Form.useForm<AdminCategoryPayload>();
  const [toast, toastContextHolder] = notification.useNotification();
  const [modalMode, setModalMode] = useState<CategoryModalMode>('create');
  const [selectedCategory, setSelectedCategory] = useState<AdminCategory | null>(null);
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
  } = useTable<AdminCategory, AdminCategoryFilterParams>({
    fetchData: adminCategoryRoleAdminApi.getAll,
    initialPageSize: 5,
  });

  useEffect(() => {
    if (!error || lastListErrorRef.current === error) {
      return;
    }

    lastListErrorRef.current = error;
    toast.error({
      message: 'Không thể tải danh mục',
      description: error,
      placement: 'topRight',
    });
  }, [error, toast]);

  const openCreateModal = () => {
    setModalMode('create');
    setSelectedCategory(null);
    categoryForm.resetFields();
    categoryForm.setFieldsValue({
      tagColor: DEFAULT_ADMIN_CATEGORY_TAG_COLOR,
    });
    setModalOpen(true);
  };

  const openUpdateModal = (category: AdminCategory) => {
    setModalMode('update');
    setSelectedCategory(category);
    categoryForm.setFieldsValue({
      description: category.description,
      name: category.name,
      tagColor: category.tagColor || DEFAULT_ADMIN_CATEGORY_TAG_COLOR,
    });
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedCategory(null);
    categoryForm.resetFields();
  };

  const handleSubmitCategory = async (values: AdminCategoryPayload) => {
    setMutationLoading(true);

    try {
      const payload: AdminCategoryPayload = {
        name: values.name,
        tagColor: values.tagColor || DEFAULT_ADMIN_CATEGORY_TAG_COLOR,
        description: values.description,
      };

      const response =
        modalMode === 'create'
          ? await adminCategoryRoleAdminApi.create(payload)
          : await adminCategoryRoleAdminApi.update(selectedCategory!.id, payload);

      if (!response.success) {
        throw new Error(response.message || 'Không thể lưu danh mục.');
      }

      toast.success({
        message: modalMode === 'create' ? 'Tạo danh mục thành công' : 'Cập nhật danh mục thành công',
        description: response.message,
        placement: 'topRight',
      });
      closeModal();
      await refetch();
    } catch (submitError) {
      toast.error({
        message: modalMode === 'create' ? 'Tạo danh mục thất bại' : 'Cập nhật danh mục thất bại',
        description: getApiErrorMessage(submitError, 'Vui lòng thử lại sau.'),
        placement: 'topRight',
      });
    } finally {
      setMutationLoading(false);
    }
  };

  const handleDeleteCategory = async (category: AdminCategory) => {
    setMutationLoading(true);

    try {
      const response = await adminCategoryRoleAdminApi.remove(category.id);

      if (!response.success) {
        throw new Error(response.message || 'Không thể xóa danh mục.');
      }

      toast.success({
        message: 'Xóa danh mục thành công',
        description: response.message,
        placement: 'topRight',
      });
      await refetch();
    } catch (deleteError) {
      toast.error({
        message: 'Xóa danh mục thất bại',
        description: getApiErrorMessage(deleteError, 'Vui lòng thử lại sau.'),
        placement: 'topRight',
      });
    } finally {
      setMutationLoading(false);
    }
  };

  const columns: ColumnsType<AdminCategory> = [
    {
      title: 'Tên danh mục',
      dataIndex: 'name',
      render: (name: string, record) => {
        const tagColor = normalizeCategoryTagColor(record.tagColor);

        return (
          <Tag
            className="!m-0 max-w-full rounded-md px-3 py-1 font-semibold"
            style={{
              backgroundColor: tagColor,
              borderColor: tagColor,
              color: getReadableTagTextColor(tagColor),
            }}
            title={name}
          >
            {name}
          </Tag>
        );
      },
    },
    {
      title: 'Mô tả',
      dataIndex: 'description',
      ellipsis: true,
    },
    {
      title: 'Số dịch vụ',
      dataIndex: 'totalService',
      width: 130,
    },
    {
      title: 'Thao tác',
      key: 'actions',
      fixed: 'right',
      width: 112,
      render: (_, record) => (
        <Space>
          <Tooltip title="Cập nhật danh mục">
            <Button
              aria-label="Cập nhật danh mục"
              icon={<EditOutlined />}
              onClick={() => openUpdateModal(record)}
            />
          </Tooltip>
          <Popconfirm
            title="Xóa danh mục"
            description="Bạn có chắc muốn xóa danh mục này?"
            okText="Xóa"
            cancelText="Hủy"
            okButtonProps={{ danger: true, loading: mutationLoading }}
            onConfirm={() => void handleDeleteCategory(record)}
          >
            <Tooltip title="Xóa danh mục">
              <Button aria-label="Xóa danh mục" danger icon={<DeleteOutlined />} />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const handleSearch = (values: CategoryFilterFormValues) => {
    handleFilterChange({
      keyword: values.keyword?.trim() || undefined,
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
        title="Quản lí danh mục"
        description="Quản lý nhóm dịch vụ để phục vụ tìm kiếm và phân loại."
        actions={
          <Space>
            <Button
              icon={<ReloadOutlined />}
              loading={loading}
              onClick={() => void refetch()}
            >
              Tải lại
            </Button>
            <Button type="primary" icon={<PlusOutlined />} onClick={openCreateModal}>
              Thêm danh mục
            </Button>
          </Space>
        }
      >
        <Card>
          <Form<CategoryFilterFormValues>
            form={filterForm}
            layout="vertical"
            initialValues={filters}
            onFinish={handleSearch}
          >
            <div className="flex flex-col gap-3 md:flex-row md:items-end">
              <Form.Item name="keyword" label="Tìm kiếm" className="!mb-0 flex-1">
                <Input allowClear placeholder="Tên hoặc mô tả danh mục" prefix={<SearchOutlined />} />
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

        <DataTable<AdminCategory>
          rowKey="id"
          dataSource={items}
          loading={loading}
          title="Danh sách danh mục"
          columns={columns}
          locale={{
            emptyText: 'Chưa có danh mục nào.',
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
        title={modalMode === 'create' ? 'Thêm danh mục' : 'Cập nhật danh mục'}
        okText={modalMode === 'create' ? 'Tạo danh mục' : 'Lưu thay đổi'}
        cancelText="Hủy"
        confirmLoading={mutationLoading}
        onCancel={closeModal}
        onOk={() => void categoryForm.submit()}
      >
        <Form<AdminCategoryPayload>
          form={categoryForm}
          initialValues={{ tagColor: DEFAULT_ADMIN_CATEGORY_TAG_COLOR }}
          layout="vertical"
          onFinish={handleSubmitCategory}
        >
          <Form.Item
            name="name"
            label="Tên danh mục"
            rules={[
              { required: true, message: 'Vui lòng nhập tên danh mục.' },
              { max: 100, message: 'Tên danh mục không vượt quá 100 ký tự.' },
            ]}
          >
            <Input placeholder="Nhập tên danh mục" maxLength={100} />
          </Form.Item>
          <Form.Item
            name="tagColor"
            label="Màu tag"
            rules={[
              { required: true, message: 'Vui lòng chọn màu tag.' },
              {
                pattern: HEX_COLOR_PATTERN,
                message: 'Màu tag phải có dạng HEX, ví dụ #FF5733.',
              },
            ]}
          >
            <CategoryColorPicker />
          </Form.Item>
          <Form.Item
            name="description"
            label="Mô tả"
            rules={[{ required: true, message: 'Vui lòng nhập mô tả.' }]}
          >
            <Input.TextArea placeholder="Nhập mô tả danh mục" rows={4} />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}
