import {
  ArrowRightOutlined,
  ClockCircleOutlined,
  EnvironmentOutlined,
  StarFilled,
} from '@ant-design/icons';
import { Button, Card, Tag, Typography } from 'antd';

import fallbackServiceImage from '@/assets/appointment-hero.png';

import type { PublicServiceCardModel } from '../types/public-service-type';

interface ServiceCardProps {
  actionLabel?: string;
  compact?: boolean;
  onSelect?: (serviceId: string) => void;
  selected?: boolean;
  service: PublicServiceCardModel;
}

export function ServiceCard({
  actionLabel = 'Chọn lịch',
  compact = false,
  onSelect,
  selected,
  service,
}: ServiceCardProps) {
  return (
    <Card
      hoverable
      className={`service-card h-full overflow-hidden ${compact ? 'service-card-compact' : ''} ${
        selected ? 'service-card-selected' : ''
      }`}
      onClick={() => onSelect?.(service.id)}
    >
      <div className="service-card-image">
        <img alt={service.name} src={service.imageUrl || fallbackServiceImage} />
        <div className="service-card-overlay" />
        <Tag className="service-card-category" color={service.accentColor}>
          {service.category}
        </Tag>
        <div className="service-card-rating">
          <StarFilled />
          <span>{service.rating}</span>
        </div>
      </div>

      <div className="service-card-content">
        <div className="flex items-start justify-between gap-4">
          <Typography.Title level={4} className="service-card-title">
            {service.name}
          </Typography.Title>
          <div className="service-card-price">
            <span>{service.price.toLocaleString('vi-VN')}đ</span>
          </div>
        </div>

        <Typography.Paragraph className="service-card-description">
          {service.description}
        </Typography.Paragraph>

        <div className="service-card-meta-grid">
          <div>
            <ClockCircleOutlined />
            <span>{service.durationMinutes} phút</span>
          </div>
          <div>
            <EnvironmentOutlined />
            <span>{service.location}</span>
          </div>
        </div>

        <Button block type={selected ? 'primary' : 'default'} icon={<ArrowRightOutlined />}>
          {actionLabel}
        </Button>
      </div>
    </Card>
  );
}
