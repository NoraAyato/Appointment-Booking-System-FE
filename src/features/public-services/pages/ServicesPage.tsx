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
import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { AppPagination } from '@/shared/components/AppPagination';
import { AppSelect } from '@/shared/components/AppSelect';
import type { AppSelectOption } from '@/shared/components/AppSelect';
import { getApiErrorMessage } from '@/shared/utils/api-error';

import { publicServiceApi } from '../api/public-service-api';
import { ServiceCard } from '../components/ServiceCard';
import { DEFAULT_PUBLIC_SERVICE_PAGE_SIZE } from '../constants/public-service-options';
import type { PublicServiceCardModel } from '../types/public-service-type';
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
  const [services, setServices] = useState<PublicServiceCardModel[]>([]);
  const [total, setTotal] = useState(0);
  const [filters, setFilters] = useState<ServiceFilterValues>({
    date: dayjs(),
  });
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PUBLIC_SERVICE_PAGE_SIZE);
  const [loading, setLoading] = useState(false);
  const [categoryLoading, setCategoryLoading] = useState(false);
  const [categoryOptions, setCategoryOptions] = useState<Array<AppSelectOption<string>>>([]);

  useEffect(() => {
    const fetchCategoryOptions = async () => {
      setCategoryLoading(true);

      try {
        const response = await publicServiceApi.getCategories();

        if (!response.success) {
          throw new Error(response.message || 'Không thể tải danh mục.');
        }

        setCategoryOptions(
          response.data.map((category) => ({
            label: category.name,
            value: category.id,
          })),
        );
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

    void fetchCategoryOptions();
  }, [toast]);

  const fetchServices = useCallback(
    async (nextFilters: ServiceFilterValues, nextPage: number, nextLimit: number) => {
      setLoading(true);

      try {
        const response = await publicServiceApi.getAll({
          categoryId: nextFilters.categoryId,
          date: nextFilters.date?.format('YYYY-MM-DD'),
          keyWord: nextFilters.keyword?.trim() || undefined,
          limit: nextLimit,
          page: nextPage,
        });

        if (!response.success) {
          throw new Error(response.message || 'Không thể tải dịch vụ.');
        }

        setServices(response.data.items);
        setTotal(response.data.total);
      } catch (fetchError) {
        setServices([]);
        setTotal(0);
        toast.error({
          message: 'Không thể tải dịch vụ',
          description: getApiErrorMessage(fetchError, 'Vui lòng thử lại sau.'),
          placement: 'topRight',
        });
      } finally {
        setLoading(false);
      }
    },
    [toast],
  );

  useEffect(() => {
    void fetchServices(filters, page, pageSize);
  }, [fetchServices, filters, page, pageSize]);

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
              Lọc theo ngày mong muốn, xem đầy đủ thông tin dịch vụ của HomeFeel và chọn trải nghiệm
              chăm sóc phù hợp tại trung tâm.
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
                  <Button block type="primary" htmlType="submit" icon={<SearchOutlined />}>
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

        {loading ? (
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
