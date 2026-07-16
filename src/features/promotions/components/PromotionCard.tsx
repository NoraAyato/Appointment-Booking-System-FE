import { CalendarOutlined, ClockCircleOutlined, GiftOutlined } from '@ant-design/icons';
import { Card, Tag, Typography } from 'antd';
import dayjs from 'dayjs';

import { formatDate } from '@/shared/utils/date-format';

import { promotionStatusLabels } from '../constants/promotion-options';
import type { PromotionCardModel } from '../types/promotion-type';

interface PromotionCardProps {
  promotion: PromotionCardModel;
}

const statusColorMap: Record<PromotionCardModel['status'], string> = {
  ACTIVE: 'success',
  ENDING_SOON: 'warning',
  UPCOMING: 'processing',
};

const getPromotionTimingLabel = (promotion: PromotionCardModel) => {
  const today = dayjs().startOf('day');
  const startDate = dayjs(promotion.startDate).startOf('day');
  const endDate = dayjs(promotion.endDate).startOf('day');

  if (promotion.status === 'UPCOMING') {
    const daysUntilStart = Math.max(0, startDate.diff(today, 'day'));

    return daysUntilStart === 0 ? 'Mở trong hôm nay' : `Mở sau ${daysUntilStart} ngày`;
  }

  const daysLeft = Math.max(0, endDate.diff(today, 'day'));

  return daysLeft === 0 ? 'Kết thúc hôm nay' : `Còn ${daysLeft} ngày`;
};

const formatDateRange = (startDate: string, endDate: string) =>
  `${formatDate(startDate, 'Chưa cập nhật', 'DD/MM')} - ${formatDate(endDate)}`;

export function PromotionCard({ promotion }: PromotionCardProps) {
  return (
    <Card hoverable className="promotion-card h-full overflow-hidden">
      <div className="promotion-card-image">
        {promotion.imageUrl ? (
          <img alt={promotion.title} src={promotion.imageUrl} />
        ) : (
          <div className="promotion-card-image-fallback">
            <GiftOutlined />
          </div>
        )}
        <div className="promotion-card-shade" />
        <Tag className="promotion-card-status" color={statusColorMap[promotion.status]}>
          {promotionStatusLabels[promotion.status]}
        </Tag>
        <div className="promotion-card-discount" style={{ backgroundColor: promotion.accentColor }}>
          {promotion.discountLabel}
        </div>
      </div>

      <div className="promotion-card-content">
        <div className="flex items-start justify-between gap-3">
          <div>
            <Typography.Title level={4} className="promotion-card-title">
              {promotion.title}
            </Typography.Title>
          </div>
          <Typography.Text className="promotion-card-timing">
            <ClockCircleOutlined /> {getPromotionTimingLabel(promotion)}
          </Typography.Text>
        </div>

        <Typography.Paragraph className="promotion-card-description">
          {promotion.description}
        </Typography.Paragraph>

        <div className="promotion-card-code-row">
          <div>
            <Typography.Text className="block !text-xs !font-semibold uppercase !text-slate-500">
              Mã ưu đãi
            </Typography.Text>
            <Typography.Text strong copyable={{ text: promotion.code }}>
              {promotion.code}
            </Typography.Text>
          </div>
          {promotion.minSpend ? (
            <Typography.Text className="promotion-card-min-spend">
              Từ {promotion.minSpend.toLocaleString('vi-VN')}đ
            </Typography.Text>
          ) : null}
        </div>

        <div className="promotion-card-meta">
          <span>
            <CalendarOutlined />
            {formatDateRange(promotion.startDate, promotion.endDate)}
          </span>
        </div>
      </div>
    </Card>
  );
}
