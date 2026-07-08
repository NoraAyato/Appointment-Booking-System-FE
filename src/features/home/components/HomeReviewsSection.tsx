import { Avatar, Card, Col, Rate, Row, Typography } from 'antd';

import { homeCustomerReviews } from '../constants/home-mock-data';

export function HomeReviewsSection() {
  return (
    <section className="home-review-section">
      <div className="mx-auto max-w-7xl px-4 py-12 md:px-8">
        <div className="mb-7 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <Typography.Text className="!font-semibold uppercase tracking-[0.16em] !text-sage">
              Khách hàng nói gì
            </Typography.Text>
            <Typography.Title level={2} className="!mb-2 !mt-2">
              Trải nghiệm được đánh giá từ những lịch hẹn thật
            </Typography.Title>
            <Typography.Text className="text-slate-500">
              Một vài nhận xét mock để mô phỏng phần review public trước khi nối API.
            </Typography.Text>
          </div>
          <div className="home-review-score">
            <span>4.8</span>
            <Rate allowHalf disabled defaultValue={4.8} />
          </div>
        </div>

        <Row gutter={[20, 20]}>
          {homeCustomerReviews.map((review) => (
            <Col key={review.id} xs={24} md={8}>
              <Card className="home-review-card h-full">
                <div className="mb-4 flex items-center gap-3">
                  <Avatar size={48} src={review.avatarUrl}>
                    {review.customerName.charAt(0).toUpperCase()}
                  </Avatar>
                  <div>
                    <Typography.Text strong>{review.customerName}</Typography.Text>
                    <Typography.Text className="block !text-xs !text-slate-500">
                      {review.serviceName} · {review.visitedAt}
                    </Typography.Text>
                  </div>
                </div>
                <Rate allowHalf disabled defaultValue={review.rating} className="mb-3 !text-base" />
                <Typography.Paragraph className="!mb-0 !leading-7 !text-slate-600">
                  “{review.comment}”
                </Typography.Paragraph>
              </Card>
            </Col>
          ))}
        </Row>
      </div>
    </section>
  );
}
