import { ArrowLeftOutlined } from '@ant-design/icons';
import { Breadcrumb, Button, Card, Col, Empty, Row, Spin, notification } from 'antd';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link, useLocation, useNavigate, useOutletContext, useParams } from 'react-router-dom';

import { useAppSelector } from '@/app/redux/hooks';
import { appointmentBookingApi } from '@/features/appointments/api/appointment-booking-api';
import {
  useServiceReviewsQuery,
  useServiceReviewStatsQuery,
} from '@/features/public-reviews/hooks/usePublicReviewsQuery';
import { getApiErrorMessage } from '@/shared/utils/api-error';

import { ServiceBookingPanel } from '../components/ServiceBookingPanel';
import { ServiceDetailGallery } from '../components/ServiceDetailGallery';
import { ServiceDetailInfo } from '../components/ServiceDetailInfo';
import { ServiceReviewSection } from '../components/ServiceReviewSection';
import { useServiceDetailBooking } from '../hooks/useServiceDetailBooking';
import { usePublicServiceDetailQuery } from '../hooks/usePublicServicesQuery';
import type {
  PublicServiceCardModel,
  PublicServiceDetailRouteState,
} from '../types/public-service-type';
import { getApiTimeValue, parseBookingDate, parseBookingTime } from '../utils/public-service-time';

const SERVICE_REVIEW_PAGE_SIZE = 3;

interface MainLayoutOutletContext {
  openLogin?: () => void;
}

export function ServiceDetailPage() {
  const { serviceId } = useParams<{ serviceId: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const { openLogin } = useOutletContext<MainLayoutOutletContext>();
  const user = useAppSelector((state) => state.users.currentUser);
  const [toast, toastContextHolder] = notification.useNotification();
  const routeState = location.state as PublicServiceDetailRouteState | null;
  const stateService = routeState?.service;
  const bookingError = routeState?.bookingError;
  const shownBookingErrorRef = useRef<string | null>(null);
  const initialService: PublicServiceCardModel | null =
    stateService && stateService.id === serviceId ? stateService : null;
  const initialDate = parseBookingDate(routeState?.date);
  const initialTime = parseBookingTime(routeState?.time);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [reviewPage, setReviewPage] = useState(1);

  const {
    data: serviceData,
    error: serviceError,
    errorUpdatedAt: serviceErrorUpdatedAt,
    isLoading: serviceLoading,
  } = usePublicServiceDetailQuery(serviceId, initialService);
  const service = serviceData ?? null;

  useEffect(() => {
    if (!bookingError || shownBookingErrorRef.current === bookingError) {
      return;
    }

    shownBookingErrorRef.current = bookingError;
    toast.warning({
      description: bookingError,
      message: 'Vui lòng chọn lại lịch hẹn',
      placement: 'topRight',
    });
  }, [bookingError, toast]);

  useEffect(() => {
    if (!serviceError) {
      return;
    }

    toast.error({
      description: getApiErrorMessage(serviceError, 'Vui lòng thử lại sau.'),
      message: 'Không thể tải chi tiết dịch vụ',
      placement: 'topRight',
    });
  }, [serviceError, serviceErrorUpdatedAt, toast]);

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
  const reviewQueryParams = useMemo(
    () => ({
      limit: SERVICE_REVIEW_PAGE_SIZE,
      page: reviewPage,
      serviceId: reviewServiceId ?? '',
    }),
    [reviewPage, reviewServiceId],
  );
  const reviewStatsQuery = useServiceReviewStatsQuery(reviewServiceId);
  const reviewsQuery = useServiceReviewsQuery(reviewQueryParams, Boolean(reviewServiceId));

  useEffect(() => {
    setReviewPage(1);
  }, [reviewServiceId]);

  const reviewError = reviewStatsQuery.error ?? reviewsQuery.error;
  const reviewErrorMessage = reviewError ? getApiErrorMessage(reviewError, 'Vui lòng thử lại sau.') : null;
  const reviews = reviewsQuery.data?.items ?? [];
  const reviewStats = reviewStatsQuery.data ?? null;
  const reviewTotal = reviewsQuery.data?.total ?? 0;
  const reviewsLoading = reviewStatsQuery.isLoading || reviewsQuery.isLoading;

  const refreshBookingAvailability = useCallback(() => {
    void fetchTimeSlotData();

    if (date && time) {
      void fetchStaffData();
    }
  }, [date, fetchStaffData, fetchTimeSlotData, time]);

  const handleReviewRetry = () => {
    void reviewStatsQuery.refetch();
    void reviewsQuery.refetch();
  };

  const handleBookService = async () => {
    if (!service || !selectedStaff || !date || !time) {
      return;
    }

    if (!user) {
      openLogin?.();
      toast.info({
        description: 'Bạn cần đăng nhập trước khi giữ lịch hẹn.',
        message: 'Vui lòng đăng nhập để đặt lịch',
        placement: 'topRight',
      });
      return;
    }

    const apiTime = getApiTimeValue(time);

    if (!apiTime) {
      return;
    }

    setBookingLoading(true);

    try {
      const response = await appointmentBookingApi.holdSlot({
        date: date.format('YYYY-MM-DD'),
        serviceId: service.id,
        staffId: selectedStaff.id,
        time: apiTime,
      });

      if (!response.success) {
        throw new Error(response.message || 'Không thể giữ lịch hẹn.');
      }

      navigate('/appointments/confirm', {
        state: {
          hold: response.data,
          service,
          staff: selectedStaff,
        },
      });
    } catch (error) {
      refreshBookingAvailability();
      toast.error({
        description: getApiErrorMessage(error, 'Vui lòng chọn lại khung giờ hoặc nhân viên.'),
        message: 'Không thể giữ lịch hẹn',
        placement: 'topRight',
      });
    } finally {
      setBookingLoading(false);
    }
  };

  if (serviceLoading) {
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

          <Button className="mb-5" icon={<ArrowLeftOutlined />} onClick={() => navigate('/services')}>
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
                  error={reviewErrorMessage}
                  loading={reviewsLoading}
                  onPageChange={(nextPage) => setReviewPage(nextPage)}
                  onRetry={handleReviewRetry}
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
