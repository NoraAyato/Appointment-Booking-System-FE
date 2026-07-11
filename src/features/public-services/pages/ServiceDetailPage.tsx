import { ArrowLeftOutlined } from '@ant-design/icons';
import { Breadcrumb, Button, Card, Col, Empty, Row, Spin, notification } from 'antd';
import { useCallback, useEffect, useState } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';

import { publicReviewApi } from '@/features/public-reviews/api/public-review-api';
import type {
  PublicServiceReviewModel,
  PublicServiceReviewStats,
} from '@/features/public-reviews/types/public-review-type';
import { getApiErrorMessage } from '@/shared/utils/api-error';

import { publicServiceApi } from '../api/public-service-api';
import { ServiceBookingPanel } from '../components/ServiceBookingPanel';
import { ServiceDetailGallery } from '../components/ServiceDetailGallery';
import { ServiceDetailInfo } from '../components/ServiceDetailInfo';
import { ServiceReviewSection } from '../components/ServiceReviewSection';
import { useServiceDetailBooking } from '../hooks/useServiceDetailBooking';
import type {
  PublicServiceCardModel,
  PublicServiceDetailRouteState,
} from '../types/public-service-type';
import { parseBookingDate, parseBookingTime } from '../utils/public-service-time';

const PUBLIC_SERVICE_DETAIL_FALLBACK_LIMIT = 100;
const SERVICE_REVIEW_PAGE_SIZE = 3;

export function ServiceDetailPage() {
  const { serviceId } = useParams<{ serviceId: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const [toast, toastContextHolder] = notification.useNotification();
  const routeState = location.state as PublicServiceDetailRouteState | null;
  const stateService = routeState?.service;
  const initialService: PublicServiceCardModel | null =
    stateService && stateService.id === serviceId ? stateService : null;
  const initialDate = parseBookingDate(routeState?.date);
  const initialTime = parseBookingTime(routeState?.time);

  const [service, setService] = useState<PublicServiceCardModel | null>(initialService);
  const [loading, setLoading] = useState(!service);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [reviews, setReviews] = useState<PublicServiceReviewModel[]>([]);
  const [reviewStats, setReviewStats] = useState<PublicServiceReviewStats | null>(null);
  const [reviewTotal, setReviewTotal] = useState(0);
  const [reviewPage, setReviewPage] = useState(1);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [reviewsError, setReviewsError] = useState<string | null>(null);

  useEffect(() => {
    if (!serviceId) {
      setService(null);
      setLoading(false);
      return;
    }

    if (stateService?.id === serviceId) {
      setService(stateService);
      setLoading(false);
      return;
    }

    const fetchService = async () => {
      setLoading(true);

      try {
        const response = await publicServiceApi.getAll({
          limit: PUBLIC_SERVICE_DETAIL_FALLBACK_LIMIT,
          page: 1,
        });

        if (!response.success) {
          throw new Error(response.message || 'Không thể tải thông tin dịch vụ.');
        }

        setService(response.data.items.find((item) => item.id === serviceId) ?? null);
      } catch (fetchError) {
        setService(null);
        toast.error({
          message: 'Không thể tải chi tiết dịch vụ',
          description: getApiErrorMessage(fetchError, 'Vui lòng thử lại sau.'),
          placement: 'topRight',
        });
      } finally {
        setLoading(false);
      }
    };

    void fetchService();
  }, [serviceId, stateService, toast]);

  const {
    date,
    fetchStaffData,
    fetchTimeSlotData,
    handleDateChange,
    selectedStaff,
    selectedStaffId,
    setSelectedStaffId,
    setTime,
    staffError,
    staffList,
    staffLoading,
    time,
    timeSlots,
    timeSlotsError,
    timeSlotsLoading,
  } = useServiceDetailBooking({
    initialDate,
    initialTime,
    serviceId: service?.id,
  });

  const reviewServiceId = service?.id;

  useEffect(() => {
    setReviewPage(1);
    setReviews([]);
    setReviewStats(null);
    setReviewTotal(0);
    setReviewsError(null);
  }, [reviewServiceId]);

  const fetchReviewData = useCallback(async () => {
    if (!reviewServiceId) {
      setReviews([]);
      setReviewStats(null);
      setReviewTotal(0);
      return;
    }

    setReviewsLoading(true);
    setReviewsError(null);

    try {
      const [statsResponse, reviewsResponse] = await Promise.all([
        publicReviewApi.getServiceStats(reviewServiceId),
        publicReviewApi.getServiceReviews({
          limit: SERVICE_REVIEW_PAGE_SIZE,
          page: reviewPage,
          serviceId: reviewServiceId,
        }),
      ]);

      if (!statsResponse.success) {
        throw new Error(statsResponse.message || 'Không thể tải thống kê đánh giá.');
      }

      if (!reviewsResponse.success) {
        throw new Error(reviewsResponse.message || 'Không thể tải danh sách đánh giá.');
      }

      setReviewStats(statsResponse.data);
      setReviews(reviewsResponse.data.items);
      setReviewTotal(reviewsResponse.data.total);
    } catch (fetchError) {
      setReviewStats(null);
      setReviews([]);
      setReviewTotal(0);
      setReviewsError(getApiErrorMessage(fetchError, 'Vui lòng thử lại sau.'));
    } finally {
      setReviewsLoading(false);
    }
  }, [reviewPage, reviewServiceId]);

  useEffect(() => {
    void fetchReviewData();
  }, [fetchReviewData]);

  const handleBookService = () => {
    if (!service || !selectedStaff || !date || !time) {
      return;
    }

    setBookingLoading(true);

    window.setTimeout(() => {
      setBookingLoading(false);
      toast.success({
        message: 'Đã ghi nhận lựa chọn dịch vụ',
        description: `${service.name} với ${selectedStaff.name}, ${date.format('DD/MM/YYYY')} lúc ${time.format('HH:mm')}.`,
        placement: 'topRight',
      });
    }, 450);
  };

  if (loading) {
    return (
      <main className="grid min-h-[520px] place-items-center bg-[#f7f4ee]">
        {toastContextHolder}
        <Spin size="large" />
      </main>
    );
  }

  if (!service) {
    return (
      <main className="bg-[#f7f4ee] px-4 py-14">
        {toastContextHolder}
        <Card className="mx-auto max-w-3xl">
          <Empty description="Không tìm thấy dịch vụ phù hợp">
            <Button type="primary" onClick={() => navigate('/services')}>
              Quay lại danh sách dịch vụ
            </Button>
          </Empty>
        </Card>
      </main>
    );
  }

  return (
    <main className="service-detail-page bg-[#f7f4ee]">
      {toastContextHolder}

      <section className="service-detail-hero-band">
        <div className="mx-auto max-w-7xl px-4 py-8 md:px-8 md:py-10">
          <Breadcrumb
            className="mb-5"
            items={[
              { title: <Link to="/">Trang chủ</Link> },
              { title: <Link to="/services">Dịch vụ</Link> },
              { title: service.name },
            ]}
          />

          <Button
            className="mb-5"
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate('/services')}
          >
            Quay lại dịch vụ
          </Button>

          <div className="service-detail-gallery-section">
            <ServiceDetailGallery service={service} />
          </div>

          <Row gutter={[24, 24]} className="service-detail-content-row">
            <Col xs={24} lg={15} xl={16}>
              <div className="service-detail-main-column">
                <ServiceDetailInfo service={service} />
                <ServiceReviewSection
                  currentPage={reviewPage}
                  error={reviewsError}
                  loading={reviewsLoading}
                  onPageChange={(nextPage) => setReviewPage(nextPage)}
                  onRetry={() => void fetchReviewData()}
                  pageSize={SERVICE_REVIEW_PAGE_SIZE}
                  reviews={reviews}
                  service={service}
                  stats={reviewStats}
                  total={reviewTotal}
                />
              </div>
            </Col>
            <Col xs={24} lg={9} xl={8} className="service-detail-booking-column">
              <ServiceBookingPanel
                date={date}
                loading={bookingLoading}
                onBook={handleBookService}
                onDateChange={handleDateChange}
                onStaffChange={setSelectedStaffId}
                onStaffRetry={() => void fetchStaffData()}
                onTimeSlotRetry={() => void fetchTimeSlotData()}
                onTimeChange={setTime}
                selectedStaffId={selectedStaffId}
                staffError={staffError}
                staffList={staffList}
                staffLoading={staffLoading}
                time={time}
                timeSlots={timeSlots}
                timeSlotsError={timeSlotsError}
                timeSlotsLoading={timeSlotsLoading}
              />
            </Col>
          </Row>
        </div>
      </section>
    </main>
  );
}
