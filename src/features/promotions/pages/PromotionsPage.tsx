import { Col, Row, Typography } from 'antd';
import { useMemo, useState } from 'react';

import { AppPagination } from '@/shared/components/AppPagination';

import { PromotionCard } from '../components/PromotionCard';
import { PROMOTION_PAGE_SIZE, promotionMockData } from '../constants/promotion-mock-data';

export function PromotionsPage() {
  const [page, setPage] = useState(1);

  const paginatedPromotions = useMemo(() => {
    const startIndex = (page - 1) * PROMOTION_PAGE_SIZE;

    return promotionMockData.slice(startIndex, startIndex + PROMOTION_PAGE_SIZE);
  }, [page]);

  return (
    <main className="promotion-page bg-[#f7f4ee]">
      <section className="promotion-hero">
        <div className="mx-auto max-w-7xl px-4 py-12 md:px-8 lg:py-16">
          <div className="flex flex-col justify-center">
            <Typography.Text className="mb-3 !font-semibold uppercase tracking-[0.18em] !text-sage">
              Khuyến mãi HomeFeel
            </Typography.Text>
            <Typography.Title className="!mb-5 max-w-3xl !text-[42px] !leading-tight !text-ink md:!text-[56px]">
              Ưu đãi chăm sóc được chọn lọc cho lịch hẹn của bạn
            </Typography.Title>
            <Typography.Paragraph className="max-w-2xl !text-lg !leading-8 !text-slate-600">
              Khám phá các mã giảm giá, combo dịch vụ và ưu đãi theo mùa tại HomeFeel Center.
              Mỗi ưu đãi hiển thị rõ mã, thời hạn và điều kiện áp dụng để khách dễ theo dõi.
            </Typography.Paragraph>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-8 md:px-8 md:py-10">
        <div className="mb-5 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <Typography.Title level={3} className="!mb-1">
              Danh sách khuyến mãi
            </Typography.Title>
            <Typography.Text className="!text-slate-500">
              Các ưu đãi hiện có tại HomeFeel Center.
            </Typography.Text>
          </div>
          <Typography.Text className="!text-slate-500">
            {promotionMockData.length} khuyến mãi
          </Typography.Text>
        </div>

        <Row gutter={[20, 20]}>
          {paginatedPromotions.map((promotion) => (
            <Col key={promotion.id} xs={24} md={12} xl={8}>
              <PromotionCard promotion={promotion} />
            </Col>
          ))}
        </Row>

        {promotionMockData.length > PROMOTION_PAGE_SIZE ? (
          <div className="promotion-pagination-bar mt-8">
            <div>
              <Typography.Text className="block !font-semibold !text-ink">
                {promotionMockData.length} khuyến mãi
              </Typography.Text>
              <Typography.Text className="!text-sm !text-slate-500">
                Trang {page} trên {Math.ceil(promotionMockData.length / PROMOTION_PAGE_SIZE)}
              </Typography.Text>
            </div>
            <AppPagination
              current={page}
              pageSize={PROMOTION_PAGE_SIZE}
              total={promotionMockData.length}
              showSizeChanger={false}
              showTotal={false}
              onChange={(nextPage) => setPage(nextPage)}
            />
          </div>
        ) : null}
      </section>
    </main>
  );
}
