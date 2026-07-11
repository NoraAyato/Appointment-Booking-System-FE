import { ReloadOutlined, StarFilled } from '@ant-design/icons';
import { Avatar, Button, Card, Empty, Image, Progress, Rate, Space, Tag, Typography } from 'antd';
import dayjs from 'dayjs';

import type {
  PublicServiceReviewModel,
  PublicServiceReviewStats,
} from '@/features/public-reviews/types/public-review-type';
import { AppPagination } from '@/shared/components/AppPagination';

import type { PublicServiceCardModel } from '../types/public-service-type';

interface ServiceReviewSectionProps {
  currentPage: number;
  error?: string | null;
  loading?: boolean;
  onPageChange: (page: number, pageSize: number) => void;
  onRetry?: () => void;
  pageSize: number;
  reviews: PublicServiceReviewModel[];
  service: PublicServiceCardModel;
  stats: PublicServiceReviewStats | null;
  total: number;
}

const RATING_LEVELS = [5, 4, 3, 2, 1];

const getInitials = (name: string) =>
  name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

export function ServiceReviewSection({
  currentPage,
  error,
  loading = false,
  onPageChange,
  onRetry,
  pageSize,
  reviews,
  service,
  stats,
  total,
}: ServiceReviewSectionProps) {
  const totalReviews = stats?.totalReviews ?? total;
  const roundedRating = Number((stats?.averageRating ?? 0).toFixed(1));
  const ratingDistribution = RATING_LEVELS.map((level) => {
    const distribution = stats?.ratingDistribution.find(
      (ratingItem) => Math.round(ratingItem.rating) === level,
    );

    return {
      count: distribution?.count ?? 0,
      level,
      percent: distribution?.percentage ?? 0,
    };
  });

  if (loading && !reviews.length && !stats) {
    return <Card className="service-review-card" loading />;
  }

  return (
    <Card className="service-review-card">
      <div className="service-review-header">
        <div>
          <Typography.Text className="!font-semibold uppercase tracking-[0.14em] !text-sage">
            Đánh giá dịch vụ
          </Typography.Text>
          <Typography.Title level={3} className="!mb-2 !mt-2">
            Trải nghiệm thực tế từ khách hàng
          </Typography.Title>
          <Typography.Text className="!text-slate-500">
            Xem cảm nhận, hình ảnh và trải nghiệm sau khi khách hàng sử dụng dịch vụ.
          </Typography.Text>
        </div>
        <Tag className="service-review-total-tag" color="success">
          {totalReviews} đánh giá
        </Tag>
      </div>

      {error ? (
        <Empty description={error}>
          {onRetry ? (
            <Button icon={<ReloadOutlined />} onClick={onRetry}>
              Tải lại đánh giá
            </Button>
          ) : null}
        </Empty>
      ) : (
        <>
          <div className="service-review-overview">
            <div className="service-review-score-panel">
              <span>{roundedRating}</span>
              <Rate allowHalf disabled value={roundedRating} />
              <Typography.Text className="!text-sm !text-slate-500">
                Điểm trung bình cho {service.name}
              </Typography.Text>
              <div className="service-review-recommendation">
                <strong>{totalReviews}</strong>
                <span>đánh giá đã được ghi nhận từ khách hàng sử dụng dịch vụ</span>
              </div>
            </div>

            <div className="service-review-distribution">
              {ratingDistribution.map((rating) => (
                <div className="service-review-distribution-row" key={rating.level}>
                  <span>{rating.level} sao</span>
                  <Progress percent={rating.percent} showInfo={false} strokeColor="#2f7d67" />
                  <Typography.Text className="!text-sm !text-slate-500">
                    {rating.count}
                  </Typography.Text>
                </div>
              ))}
            </div>
          </div>

          {reviews.length ? (
            <div className="service-review-list">
              {reviews.map((review) => (
                <article className="service-review-item" key={review.id}>
                  <Avatar size={48} src={review.avatarUrl}>
                    {getInitials(review.customerName)}
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <div className="service-review-item-header">
                      <div>
                        <Typography.Text className="block !font-semibold !text-ink">
                          {review.customerName}
                        </Typography.Text>
                        <Typography.Text className="!text-sm !text-slate-500">
                          Dịch vụ ngày {dayjs(review.serviceDate).format('DD/MM/YYYY')} với{' '}
                          {review.staffName}
                        </Typography.Text>
                      </div>
                      <Space size={6} className="service-review-rating-pill">
                        <StarFilled />
                        <span>{review.rating}</span>
                      </Space>
                    </div>
                    <Typography.Paragraph className="!mb-0 !mt-3 !leading-7 !text-slate-600">
                      {review.content}
                    </Typography.Paragraph>
                    {review.imageUrls.length ? (
                      <Image.PreviewGroup>
                        <div className="service-review-images">
                          {review.imageUrls.map((imageUrl, imageIndex) => (
                            <Image
                              alt={`Ảnh đánh giá ${imageIndex + 1} của ${review.customerName}`}
                              className="service-review-image"
                              key={`${review.id}-${imageUrl}`}
                              src={imageUrl}
                            />
                          ))}
                        </div>
                      </Image.PreviewGroup>
                    ) : null}
                    <Typography.Text className="mt-3 block !text-xs !text-slate-400">
                      Gửi đánh giá {dayjs(review.createdAt).format('DD/MM/YYYY')}
                    </Typography.Text>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <Empty className="mt-5" description="Chưa có đánh giá cho dịch vụ này" />
          )}

          {total > pageSize ? (
            <div className="service-review-pagination">
              <Typography.Text className="!text-sm !text-slate-500">
                Trang {currentPage} / {Math.ceil(total / pageSize)}
              </Typography.Text>
              <AppPagination
                current={currentPage}
                disabled={loading}
                pageSize={pageSize}
                showSizeChanger={false}
                showTotal={false}
                total={total}
                onChange={onPageChange}
              />
            </div>
          ) : null}
        </>
      )}
    </Card>
  );
}
