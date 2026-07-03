import {
  CalendarOutlined,
  CheckCircleFilled,
  ClockCircleOutlined,
  EnvironmentOutlined,
  SendOutlined,
} from '@ant-design/icons';
import {
  Avatar,
  Button,
  Card,
  Col,
  DatePicker,
  Form,
  Input,
  Row,
  Select,
  Space,
  Statistic,
  Typography,
  message,
} from 'antd';
import dayjs from 'dayjs';
import type { Dayjs } from 'dayjs';
import { useEffect, useMemo, useState } from 'react';
import { useOutletContext } from 'react-router-dom';

import { useAppSelector } from '@/app/redux/hooks';
import heroImage from '@/assets/appointment-hero.png';
import { APP_BRAND } from '@/shared/constants/brand';

import { appointmentApi } from '../api/appointment-api';
import { ServiceCard } from '../components/ServiceCard';
import { timeSlots } from '../constants/appointment-mock-data';
import type { BookingPayload, Service, Specialist } from '../types/appointment-type';

interface MainLayoutContext {
  openLogin: () => void;
}

interface BookingFormValues extends Omit<BookingPayload, 'date'> {
  date: Dayjs;
}

export function HomePage() {
  const [form] = Form.useForm<BookingFormValues>();
  const [services, setServices] = useState<Service[]>([]);
  const [specialists, setSpecialists] = useState<Specialist[]>([]);
  const [selectedServiceId, setSelectedServiceId] = useState<string>('srv-01');
  const [submitting, setSubmitting] = useState(false);
  const user = useAppSelector((state) => state.auth.user);
  const { openLogin } = useOutletContext<MainLayoutContext>();

  useEffect(() => {
    Promise.all([appointmentApi.getServices(), appointmentApi.getSpecialists()]).then(
      ([servicesResponse, specialistsResponse]) => {
        setServices(servicesResponse.data);
        setSpecialists(specialistsResponse.data);
      },
    );
  }, []);

  const selectedService = services.find((service) => service.id === selectedServiceId);

  const availableSpecialists = useMemo(
    () =>
      specialists.filter((specialist) =>
        specialist.availableServiceIds.includes(selectedServiceId),
      ),
    [selectedServiceId, specialists],
  );

  useEffect(() => {
    form.setFieldsValue({
      serviceId: selectedServiceId,
      specialistId: availableSpecialists[0]?.id,
      date: dayjs().add(1, 'day'),
      time: timeSlots[1],
    });
  }, [availableSpecialists, form, selectedServiceId]);

  const handleSubmit = async (values: BookingFormValues) => {
    if (!user) {
      openLogin();
      return;
    }

    const payload: BookingPayload = {
      ...values,
      date: values.date.format('YYYY-MM-DD'),
    };

    setSubmitting(true);
    await appointmentApi.createBooking(payload);
    setSubmitting(false);
    message.success('Đặt lịch thành công. Lịch hẹn đã được thêm vào mock flow.');
  };

  return (
    <main>
      <section className="hero-section" style={{ backgroundImage: `url(${heroImage})` }}>
        <div className="hero-overlay">
          <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 md:px-8 lg:grid-cols-[1fr_430px] lg:py-16">
            <div className="flex min-h-[520px] flex-col justify-center">
              <Space className="mb-4 rounded-full bg-white/85 px-4 py-2 text-sage shadow-sm">
                <CheckCircleFilled />
                <span className="font-semibold">Đặt lịch nhanh, rõ dịch vụ, rõ khung giờ</span>
              </Space>
              <Typography.Title className="hero-title !mb-5 !text-white">
                {APP_BRAND.name} cho những lịch hẹn chăm sóc nhẹ nhàng hơn
              </Typography.Title>
              <Typography.Paragraph className="max-w-2xl !text-lg !leading-8 !text-white/90">
                Chọn dịch vụ, chuyên viên và khung giờ phù hợp trong một trải nghiệm rõ ràng,
                ấm áp và đủ tin cậy cho các nhu cầu chăm sóc tại nhà.
              </Typography.Paragraph>

              <div className="mt-8 grid max-w-2xl grid-cols-3 gap-3">
                <div className="metric-tile">
                  <Statistic value={24} suffix="/7" />
                  <span>Lịch online</span>
                </div>
                <div className="metric-tile">
                  <Statistic value={4.8} precision={1} />
                  <span>Đánh giá</span>
                </div>
                <div className="metric-tile">
                  <Statistic value={18} suffix="+" />
                  <span>Dịch vụ</span>
                </div>
              </div>
            </div>

            <Card className="booking-panel self-end shadow-soft">
              <div className="mb-5">
                <Typography.Title level={3} className="!mb-1">
                  Đặt lịch hẹn
                </Typography.Title>
                <Typography.Text className="text-slate-500">
                  {user ? `Xin chào ${user.fullName}` : 'Đăng nhập khi gửi lịch để lưu thông tin'}
                </Typography.Text>
              </div>

              <Form form={form} layout="vertical" onFinish={handleSubmit}>
                <Form.Item name="serviceId" label="Dịch vụ" rules={[{ required: true }]}> 
                  <Select
                    options={services.map((service) => ({
                      value: service.id,
                      label: service.name,
                    }))}
                    onChange={(value) => setSelectedServiceId(value)}
                  />
                </Form.Item>

                <Form.Item name="specialistId" label="Chuyên viên" rules={[{ required: true }]}> 
                  <Select
                    options={availableSpecialists.map((specialist) => ({
                      value: specialist.id,
                      label: specialist.fullName,
                    }))}
                  />
                </Form.Item>

                <Row gutter={12}>
                  <Col span={12}>
                    <Form.Item name="date" label="Ngày" rules={[{ required: true }]}> 
                      <DatePicker
                        className="w-full"
                        format="DD/MM/YYYY"
                        disabledDate={(date) => date.isBefore(dayjs().startOf('day'))}
                      />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item name="time" label="Giờ" rules={[{ required: true }]}> 
                      <Select options={timeSlots.map((slot) => ({ value: slot, label: slot }))} />
                    </Form.Item>
                  </Col>
                </Row>

                <Form.Item name="note" label="Ghi chú">
                  <Input.TextArea rows={3} placeholder="Triệu chứng, nhu cầu hoặc yêu cầu riêng" />
                </Form.Item>

                <Button
                  block
                  type="primary"
                  htmlType="submit"
                  loading={submitting}
                  icon={<SendOutlined />}
                >
                  {user ? 'Xác nhận lịch hẹn' : 'Đăng nhập để đặt lịch'}
                </Button>
              </Form>
            </Card>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 md:px-8">
        <div className="mb-7 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <Typography.Title level={2} className="!mb-2">
              Dịch vụ nổi bật
            </Typography.Title>
            <Typography.Text className="text-slate-500">
              Gợi ý những dịch vụ được khách hàng lựa chọn nhiều trong tuần.
            </Typography.Text>
          </div>
          {selectedService ? (
            <Space className="rounded-lg bg-white px-4 py-3 shadow-sm">
              <CalendarOutlined className="text-sage" />
              <span className="font-semibold text-ink">{selectedService.durationMinutes} phút</span>
            </Space>
          ) : null}
        </div>

        <Row gutter={[20, 20]}>
          {services.map((service) => (
            <Col key={service.id} xs={24} sm={12} lg={6}>
              <ServiceCard
                service={service}
                selected={selectedServiceId === service.id}
                onSelect={setSelectedServiceId}
              />
            </Col>
          ))}
        </Row>
      </section>

      <section className="bg-white">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 py-12 md:grid-cols-3 md:px-8">
          {availableSpecialists.map((specialist) => (
            <Card key={specialist.id} className="h-full">
              <Space align="start" size={14}>
                <Avatar size={56} src={specialist.avatarUrl} />
                <div>
                  <Typography.Title level={4} className="!mb-1">
                    {specialist.fullName}
                  </Typography.Title>
                  <Typography.Text className="block text-slate-500">{specialist.title}</Typography.Text>
                  <Space className="mt-3 text-slate-500">
                    <ClockCircleOutlined />
                    <span>Ca còn trống hôm nay</span>
                  </Space>
                </div>
              </Space>
            </Card>
          ))}
          <Card className="h-full border-sage/20 bg-[#f3f8f5]">
            <Space direction="vertical" size={10}>
              <EnvironmentOutlined className="text-2xl text-sage" />
              <Typography.Title level={4} className="!mb-0">
                Linh hoạt địa điểm
              </Typography.Title>
              <Typography.Text className="text-slate-600">
                Hỗ trợ lịch tại cơ sở, online hoặc tư vấn trước khi chọn dịch vụ.
              </Typography.Text>
            </Space>
          </Card>
        </div>
      </section>
    </main>
  );
}
