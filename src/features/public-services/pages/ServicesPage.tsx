import { CalendarOutlined, ReloadOutlined, SearchOutlined } from '@ant-design/icons';
import {
  Button,
  Card,
  Col,
  DatePicker,
  Empty,
  Form,
  Input,
  Row,
  Space,
  Typography,
  notification,
} from 'antd';
import dayjs from 'dayjs';
import type { Dayjs } from 'dayjs';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { AppPagination } from '@/shared/components/AppPagination';
import { AppSelect } from '@/shared/components/AppSelect';
import type { AppSelectOption } from '@/shared/components/AppSelect';
import { getApiErrorMessage } from '@/shared/utils/api-error';

import { ServiceCard } from '../components/ServiceCard';
import { DEFAULT_PUBLIC_SERVICE_PAGE_SIZE } from '../constants/public-service-options';
import {
  usePublicServiceCategoriesQuery,
  usePublicServicesQuery,
} from '../hooks/usePublicServicesQuery';
import type {
  PublicServiceCardModel,
  PublicServiceFilterParams,
} from '../types/public-service-type';
import { isDateBeforeToday } from '../utils/public-service-time';

interface ServiceFilterValues {
  categoryId?: string;
  date?: Dayjs | null;
  keyword?: string;
}

export function ServicesPage() {
  const [form] = Form.useForm<ServiceFilterValues>();
  const navigate = useNavigate();
  const [toast, toastContextHolder] = notification.useNotification();
  const [filters, setFilters] = useState<ServiceFilterValues>({
    date: dayjs(),
  });
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PUBLIC_SERVICE_PAGE_SIZE);

  const serviceQueryParams = useMemo<PublicServiceFilterParams>(
    () => ({
      categoryId: filters.categoryId,
      date: filters.date?.format('YYYY-MM-DD'),
      keyWord: filters.keyword?.trim() || undefined,
      limit: pageSize,
      page,
    }),
    [filters.categoryId, filters.date, filters.keyword, page, pageSize],
  );

  const {
    data: servicePage,
    error: servicesError,
    errorUpdatedAt: servicesErrorUpdatedAt,
    isFetching: servicesFetching,
    isLoading: servicesLoading,
  } = usePublicServicesQuery(serviceQueryParams);

  const {
    data: categories = [],
    error: categoryError,
    errorUpdatedAt: categoryErrorUpdatedAt,
    isLoading: categoryLoading,
  } = usePublicServiceCategoriesQuery();

  const categoryOptions = useMemo<Array<AppSelectOption<string>>>(
    () =>
      categories.map((category) => ({
        label: category.name,
        value: category.id,
      })),
    [categories],
  );

  useEffect(() => {
    if (!categoryError) {
      return;
    }

    toast.error({
      description: getApiErrorMessage(categoryError, 'Vui lòng thử lại sau.'),
      message: 'Không thể tải danh mục',
      placement: 'topRight',
    });
  }, [categoryError, categoryErrorUpdatedAt, toast]);

  useEffect(() => {
    if (!servicesError) {
      return;
    }

    toast.error({
      description: getApiErrorMessage(servicesError, 'Vui lòng thử lại sau.'),
      message: 'Không thể tải dịch vụ',
      placement: 'topRight',
    });
  }, [servicesError, servicesErrorUpdatedAt, toast]);

  const services = servicePage?.items ?? [];
  const total = servicePage?.total ?? 0;

  const handleFilter = (values: ServiceFilterValues) => {
    setFilters(values);
    setPage(1);
  };

  const handleReset = () => {
    const nextFilters = {
      date: dayjs(),
    };

    form.setFieldsValue(nextFilters);
    setFilters(nextFilters);
    setPage(1);
  };

  const handleViewDetail = (service: PublicServiceCardModel) => {
    navigate(`/services/${service.id}`, {
      state: {
        date: filters.date?.format('YYYY-MM-DD'),
        service,
      },
    });
  };

  return (
    <main className="bg-[#f7f4ee]">
      {toastContextHolder}

      <section className="services-hero">
        <div className="mx-auto max-w-7xl px-4 py-12 md:px-8 lg:py-16">
          <div className="flex flex-col justify-center">
            <Typography.Text className="mb-3 !font-semibold uppercase tracking-[0.18em] !text-sage">
              Dịch vụ HomeFeel
            </Typography.Text>
            <Typography.Title className="!mb-5 max-w-3xl !text-[42px] !leading-tight !text-ink md:!text-[56px]">
              Chọn dịch vụ tại trung tâm phù hợp với lịch của bạn
            </Typography.Title>
            <Typography.Paragraph className="max-w-2xl !text-lg !leading-8 !text-slate-600">
              Lọc theo ngày mong muốn, xem đầy đủ thông tin dịch vụ của HomeFeel và chọn trải
              nghiệm chăm sóc phù hợp tại trung tâm.
            </Typography.Paragraph>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-8 md:px-8 md:py-10">
        <Card className="service-filter-card mb-6">
          <Form<ServiceFilterValues>
            form={form}
            layout="vertical"
            initialValues={filters}
            onFinish={handleFilter}
          >
            <div className="service-filter-grid">
              <div>
                <Form.Item name="keyword" label="Tìm dịch vụ">
                  <Input allowClear prefix={<SearchOutlined />} placeholder="Tên hoặc mô tả" />
                </Form.Item>
              </div>
              <div>
                <Form.Item name="date" label="Ngày">
                  <DatePicker
                    className="service-filter-date-picker w-full"
                    format="DD/MM/YYYY"
                    suffixIcon={<CalendarOutlined />}
                    disabledDate={isDateBeforeToday}
                  />
                </Form.Item>
              </div>
              <div>
                <Form.Item name="categoryId" label="Danh mục">
                  <AppSelect
                    allowClear
                    loading={categoryLoading}
                    options={categoryOptions}
                    placeholder="Tất cả"
                  />
                </Form.Item>
              </div>
              <div>
                <Space className="service-filter-actions mb-6 w-full" size={10}>
                  <Button
                    block
                    type="primary"
                    htmlType="submit"
                    icon={<SearchOutlined />}
                    loading={servicesFetching}
                  >
                    Lọc
                  </Button>
                  <Button icon={<ReloadOutlined />} onClick={handleReset} />
                </Space>
              </div>
            </div>
          </Form>
        </Card>

        <div className="mb-5 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <Typography.Title level={3} className="!mb-1">
              Tất cả dịch vụ
            </Typography.Title>
            <Typography.Text className="!text-slate-500">
              {filters.date ? `Ngày ${filters.date.format('DD/MM/YYYY')}` : 'Chưa chọn ngày'}
            </Typography.Text>
          </div>
          <Typography.Text className="!text-slate-500">
            Hiển thị {total} dịch vụ phù hợp
          </Typography.Text>
        </div>

        {servicesLoading ? (
          <Row gutter={[20, 20]}>
            {Array.from({ length: pageSize }).map((_, index) => (
              <Col key={index} xs={24} md={12} xl={8}>
                <Card className="h-full" loading />
              </Col>
            ))}
          </Row>
        ) : services.length > 0 ? (
          <Row gutter={[20, 20]}>
            {services.map((service) => (
              <Col key={service.id} xs={24} md={12} xl={8}>
                <ServiceCard
                  service={service}
                  actionLabel="Xem chi tiết"
                  onSelect={() => handleViewDetail(service)}
                />
              </Col>
            ))}
          </Row>
        ) : (
          <Card>
            <Empty description="Không tìm thấy dịch vụ phù hợp" />
          </Card>
        )}

        {total > 0 ? (
          <div className="service-pagination-bar mt-8">
            <div>
              <Typography.Text className="block !font-semibold !text-ink">
                {total} dịch vụ phù hợp
              </Typography.Text>
              <Typography.Text className="!text-sm !text-slate-500">
                Trang {page} trên {Math.max(1, Math.ceil(total / pageSize))}
              </Typography.Text>
            </div>
            <AppPagination
              current={page}
              pageSize={pageSize}
              pageSizeOptions={[6, 9, 12]}
              total={total}
              onChange={(nextPage, nextPageSize) => {
                setPage(nextPage);
                setPageSize(nextPageSize);
              }}
              showSizeChanger={false}
              showTotal={false}
            />
          </div>
        ) : null}
      </section>
    </main>
  );
}
