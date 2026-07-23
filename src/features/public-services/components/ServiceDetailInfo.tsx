import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  EnvironmentOutlined,
  StarFilled,
} from '@ant-design/icons';
import { Card, Tag, Typography } from 'antd';

import {
  publicServiceDetailHighlights,
  publicServicePreparationNotes,
} from '../constants/public-service-detail-mock-data';
import type { PublicServiceCardModel } from '../types/public-service-type';

interface ServiceDetailInfoProps {
  service: PublicServiceCardModel;
}

export function ServiceDetailInfo({ service }: ServiceDetailInfoProps) {
  return (
    <Card className="service-detail-info-card">
      <div className="service-detail-info-heading">
        <Typography.Text className="!font-semibold uppercase tracking-[0.14em] !text-sage">
          Chi tiết dịch vụ
        </Typography.Text>
        <Tag className="service-detail-category-tag" color={service.accentColor}>
          {service.category}
        </Tag>
      </div>

      <Typography.Title level={3} className="service-detail-info-title">
        {service.name}
      </Typography.Title>
      <Typography.Paragraph className="!text-base !leading-7 !text-slate-600">
        {service.description}
      </Typography.Paragraph>

      <div className="service-detail-price-inline">
        <div>
          <Typography.Text className="block !text-sm !font-semibold uppercase tracking-[0.12em] !text-slate-500">
            Giá dịch vụ
          </Typography.Text>
          <Typography.Title level={2} className="!mb-0 !mt-1 !text-sage">
            {service.price.toLocaleString('vi-VN')}đ
          </Typography.Title>
        </div>
        <div className="service-detail-meta-inline">
          <span>
            <ClockCircleOutlined /> {service.durationMinutes} phút
          </span>
          <span>
            <StarFilled /> {service.rating}
          </span>
          <span>
            <EnvironmentOutlined /> {service.location}
          </span>
        </div>
      </div>

      <div className="service-detail-highlights">
        {publicServiceDetailHighlights.map((highlight) => (
          <div key={highlight}>
            <CheckCircleOutlined />
            <span>{highlight}</span>
          </div>
        ))}
      </div>

      <div className="service-note-grid">
        {publicServicePreparationNotes.map((note) => (
          <div key={note}>
            <span />
            <Typography.Text>{note}</Typography.Text>
          </div>
        ))}
      </div>
    </Card>
  );
}
