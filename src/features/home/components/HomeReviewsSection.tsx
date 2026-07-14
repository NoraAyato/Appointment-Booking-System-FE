import { ReloadOutlined } from '@ant-design/icons';
import { Avatar, Button, Card, Col, Empty, Rate, Row, Typography } from 'antd';
import { useCallback, useEffect, useMemo, useState } from 'react';

import { publicReviewApi } from '@/features/public-reviews/api/public-review-api';
import type { PublicTopRatedReviewModel } from '@/features/public-reviews/types/public-review-type';
import { getApiErrorMessage } from '@/shared/utils/api-error';
import { getAvatarInitial } from '@/shared/utils/avatar';
import { formatDate } from '@/shared/utils/date-format';

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

export function HomeReviewsSection() {
  const [reviews, setReviews] = useState<PublicTopRatedReviewModel[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTopRatedReviews = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await publicReviewApi.getTopRated();

      if (!response.success) {
        throw new Error(response.message || 'Không thể tải đánh giá nổi bật.');
      }

      setReviews(response.data);
    } catch (fetchError) {
      setReviews([]);
      setError(getApiErrorMessage(fetchError, 'Vui lòng thử lại sau.'));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchTopRatedReviews();
  }, [fetchTopRatedReviews]);

  const averageRating = useMemo(() => {
    if (!reviews.length) {
      return 0;
    }

    return reviews.reduce((total, review) => total + review.rating, 0) / reviews.length;
  }, [reviews]);
  const responsiveSpan = useMemo(() => getResponsiveSpan(reviews.length), [reviews.length]);

  return (
    <section className="home-review-section">
      <div className="mx-auto max-w-7xl px-4 py-12 md:px-8">
        <div className="mb-7 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <Typography.Text className="!font-semibold uppercase tracking-[0.16em] !text-sage">
              Khách hàng nói gì
            </Typography.Text>
            <Typography.Title level={2} className="!mb-2 !mt-2">
              Trải nghiệm được đánh giá từ những lịch hẹn
            </Typography.Title>
            <Typography.Text className="text-slate-500">
              Những phản hồi nổi bật từ khách hàng đã sử dụng dịch vụ tại HomeFeel.
            </Typography.Text>
          </div>
          <div className="home-review-score">
            <span>{reviews.length ? averageRating.toFixed(1) : '--'}</span>
            <Rate allowHalf disabled value={averageRating} />
          </div>
        </div>

        {loading ? (
          <Row gutter={[20, 20]}>
            {Array.from({ length: 3 }).map((_, index) => (
              <Col key={index} xs={24} md={12} xl={8}>
                <Card className="home-review-card h-full" loading />
              </Col>
            ))}
          </Row>
        ) : error ? (
          <Card>
            <Empty description={error}>
              <Button icon={<ReloadOutlined />} onClick={() => void fetchTopRatedReviews()}>
                Tải lại
              </Button>
            </Empty>
          </Card>
        ) : reviews.length ? (
          <Row gutter={[20, 20]} justify={reviews.length < 3 ? 'center' : 'start'}>
            {reviews.map((review) => (
              <Col key={review.id} xs={24} md={responsiveSpan.md} xl={responsiveSpan.xl}>
                <Card className="home-review-card h-full overflow-hidden">
                  {review.imageUrl ? (
                    <img
                      alt={`Đánh giá dịch vụ ${review.serviceName}`}
                      className="home-review-image"
                      src={review.imageUrl}
                    />
                  ) : null}

                  <div className="mb-4 flex items-center gap-3">
                    <Avatar size={48} src={review.avatarUrl}>
                      {getAvatarInitial(review.customerName)}
                    </Avatar>
                    <div>
                      <Typography.Text strong>{review.customerName}</Typography.Text>
                      <Typography.Text className="block !text-xs !text-slate-500">
                        {review.serviceName} · {formatDate(review.serviceDate)}
                      </Typography.Text>
                    </div>
                  </div>
                  <Rate allowHalf disabled value={review.rating} className="mb-3 !text-base" />
                  <Typography.Paragraph className="!mb-0 !leading-7 !text-slate-600">
                    “{review.content}”
                  </Typography.Paragraph>
                </Card>
              </Col>
            ))}
          </Row>
        ) : (
          <Card>
            <Empty description="Chưa có đánh giá nổi bật" />
          </Card>
        )}
      </div>
    </section>
  );
}
