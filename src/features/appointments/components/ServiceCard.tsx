import { ClockCircleOutlined, StarFilled } from '@ant-design/icons';
import { Card, Space, Tag, Typography } from 'antd';

import type { Service } from '../types/appointment-type';

interface ServiceCardProps {
  service: Service;
  selected: boolean;
  onSelect: (serviceId: string) => void;
}

export function ServiceCard({ service, selected, onSelect }: ServiceCardProps) {
  return (
    <Card
      hoverable
      className={`service-card h-full ${selected ? 'service-card-selected' : ''}`}
      onClick={() => onSelect(service.id)}
    >
      <div className="mb-4 flex items-center justify-between gap-3">
        <Tag color={service.accentColor}>{service.category}</Tag>
        <Space size={4} className="text-sm text-amber-600">
          <StarFilled />
          <span>{service.rating}</span>
        </Space>
      </div>

      <Typography.Title level={4} className="!mb-2 !text-[19px] !leading-snug">
        {service.name}
      </Typography.Title>
      <Typography.Paragraph className="!mb-5 !text-slate-500">
        {service.description}
      </Typography.Paragraph>

      <div className="mt-auto flex items-center justify-between border-t border-slate-100 pt-4">
        <Space className="text-slate-500">
          <ClockCircleOutlined />
          <span>{service.durationMinutes} phút</span>
        </Space>
        <span className="font-bold text-ink">{service.price.toLocaleString('vi-VN')}đ</span>
      </div>
    </Card>
  );
}
