import { Button, Card, Col, Empty, Row, Typography } from 'antd';
import { useCallback, useEffect, useState } from 'react';

import { AppPagination } from '@/shared/components/AppPagination';
import { getApiErrorMessage } from '@/shared/utils/api-error';

import { promotionApi } from '../api/promotion-api';
import { PromotionCard } from '../components/PromotionCard';
import { PROMOTION_PAGE_SIZE } from '../constants/promotion-options';
import type { PromotionCardModel } from '../types/promotion-type';

export function PromotionsPage() {
  const [promotions, setPromotions] = useState<PromotionCardModel[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fetchPromotions = useCallback(async () => {
    setLoading(true);
    setErrorMessage(null);

    try {
      const response = await promotionApi.getPublicPromotions({
        limit: PROMOTION_PAGE_SIZE,
        page,
      });

      if (!response.success) {
        throw new Error(response.message || 'Không thể tải danh sách khuyến mãi.');
      }

      setPromotions(response.data.items);
      setTotal(response.data.total);
    } catch (fetchError) {
      setPromotions([]);
      setTotal(0);
      setErrorMessage(
        getApiErrorMessage(fetchError, 'Không thể tải danh sách khuyến mãi.'),
      );
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    void fetchPromotions();
  }, [fetchPromotions]);

  const totalPages = Math.max(1, Math.ceil(total / PROMOTION_PAGE_SIZE));

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
          <Typography.Text className="!text-slate-500">{total} khuyến mãi</Typography.Text>
        </div>

        {loading ? (
          <Row gutter={[20, 20]}>
            {Array.from({ length: PROMOTION_PAGE_SIZE }).map((_, index) => (
              <Col key={index} xs={24} md={12} xl={8}>
                <Card className="h-full" loading />
              </Col>
            ))}
          </Row>
        ) : errorMessage ? (
          <Card>
            <Empty description={errorMessage}>
              <Button type="primary" onClick={() => void fetchPromotions()}>
                Tải lại
              </Button>
            </Empty>
          </Card>
        ) : promotions.length > 0 ? (
          <Row gutter={[20, 20]}>
            {promotions.map((promotion) => (
              <Col key={promotion.id} xs={24} md={12} xl={8}>
                <PromotionCard promotion={promotion} />
              </Col>
            ))}
          </Row>
        ) : (
          <Card>
            <Empty description="Hiện chưa có khuyến mãi công khai" />
          </Card>
        )}

        {total > PROMOTION_PAGE_SIZE ? (
          <div className="promotion-pagination-bar mt-8">
            <div>
              <Typography.Text className="block !font-semibold !text-ink">
                {total} khuyến mãi
              </Typography.Text>
              <Typography.Text className="!text-sm !text-slate-500">
                Trang {page} trên {totalPages}
              </Typography.Text>
            </div>
            <AppPagination
              current={page}
              pageSize={PROMOTION_PAGE_SIZE}
              total={total}
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
