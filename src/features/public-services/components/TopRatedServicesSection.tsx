import { CalendarOutlined, ReloadOutlined } from '@ant-design/icons';
import { Button, Card, Col, Empty, Row, Typography } from 'antd';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';

import { getApiErrorMessage } from '@/shared/utils/api-error';

import { publicServiceApi } from '../api/public-service-api';
import type { PublicServiceCardModel } from '../types/public-service-type';
import { ServiceCard } from './ServiceCard';

const getResponsiveSpan = (total: number) => {
  if (total <= 1) {
    return {
      md: 12,
      xl: 8,
    };
  }

  if (total === 2) {
    return {
      md: 11,
      xl: 8,
    };
  }

  return {
    md: 12,
    xl: 8,
  };
};

export function TopRatedServicesSection() {
  const [services, setServices] = useState<PublicServiceCardModel[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTopRatedServices = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await publicServiceApi.getTopRated();

      if (!response.success) {
        throw new Error(response.message || 'Không thể tải dịch vụ nổi bật.');
      }

      setServices(response.data);
    } catch (fetchError) {
      setServices([]);
      setError(getApiErrorMessage(fetchError, 'Vui lòng thử lại sau.'));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchTopRatedServices();
  }, [fetchTopRatedServices]);

  const responsiveSpan = useMemo(() => getResponsiveSpan(services.length), [services.length]);

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 md:px-8">
      <div className="mb-7 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <Typography.Text className="!font-semibold uppercase tracking-[0.16em] !text-sage">
            Dịch vụ nổi bật
          </Typography.Text>
          <Typography.Title level={2} className="!mb-2 !mt-2">
            Gợi ý chăm sóc được đánh giá tốt
          </Typography.Title>
          <Typography.Text className="text-slate-500">
            Những dịch vụ có điểm đánh giá cao nhất tại HomeFeel.
          </Typography.Text>
        </div>
        <Link to="/services">
          <Button icon={<CalendarOutlined />}>Xem tất cả dịch vụ</Button>
        </Link>
      </div>

      {loading ? (
        <Row gutter={[20, 20]}>
          {Array.from({ length: 3 }).map((_, index) => (
            <Col key={index} xs={24} md={12} xl={8}>
              <Card className="h-full" loading />
            </Col>
          ))}
        </Row>
      ) : error ? (
        <Card>
          <Empty description={error}>
            <Button icon={<ReloadOutlined />} onClick={() => void fetchTopRatedServices()}>
              Tải lại
            </Button>
          </Empty>
        </Card>
      ) : services.length ? (
        <Row gutter={[20, 20]} justify={services.length < 3 ? 'center' : 'start'}>
          {services.map((service) => (
            <Col key={service.id} xs={24} md={responsiveSpan.md} xl={responsiveSpan.xl}>
              <ServiceCard compact service={service} actionLabel="Xem chi tiết" />
            </Col>
          ))}
        </Row>
      ) : (
        <Card>
          <Empty description="Chưa có dịch vụ nổi bật" />
        </Card>
      )}
    </section>
  );
}
