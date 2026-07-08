import {
  CalendarOutlined,
  CheckCircleFilled,
  ClockCircleOutlined,
  HeartOutlined,
  SafetyCertificateOutlined,
  TeamOutlined,
} from '@ant-design/icons';
import { Button, Card, Col, Row, Space, Statistic, Typography } from 'antd';
import { Link } from 'react-router-dom';

import heroImage from '@/assets/appointment-hero.png';
import { APP_BRAND } from '@/shared/constants/brand';

const valueItems = [
  {
    icon: <ClockCircleOutlined />,
    title: 'Tôn trọng thời gian',
    text: 'Mỗi lịch hẹn được thiết kế để người dùng biết rõ dịch vụ, thời lượng và khung giờ trước khi đến trung tâm.',
  },
  {
    icon: <SafetyCertificateOutlined />,
    title: 'Rõ ràng trong dịch vụ',
    text: 'Thông tin giá, mô tả, trạng thái và đánh giá được trình bày nhất quán để khách hàng dễ so sánh.',
  },
  {
    icon: <HeartOutlined />,
    title: 'Chăm sóc có cảm giác',
    text: 'HomeFeel ưu tiên trải nghiệm nhẹ nhàng, tinh tế và gần gũi trong từng điểm chạm của hành trình đặt lịch.',
  },
  {
    icon: <TeamOutlined />,
    title: 'Đội ngũ được điều phối',
    text: 'Nhân viên, ca làm và dịch vụ được tổ chức để việc vận hành trung tâm mượt mà hơn khi kết nối API thật.',
  },
];

export function AboutPage() {
  return (
    <main className="bg-[#f7f4ee]">
      <section className="about-hero" style={{ backgroundImage: `url(${heroImage})` }}>
        <div className="about-hero-overlay">
          <div className="mx-auto flex min-h-[520px] max-w-7xl flex-col justify-center px-4 py-14 md:px-8">
            <Space className="mb-4 w-fit rounded-full bg-white/88 px-4 py-2 text-sage shadow-sm">
              <CheckCircleFilled />
              <span className="font-semibold">Một trung tâm, một trải nghiệm đặt lịch rõ ràng</span>
            </Space>
            <Typography.Title className="hero-title !mb-5 !text-white">
              Về {APP_BRAND.name}
            </Typography.Title>
            <Typography.Paragraph className="max-w-2xl !text-lg !leading-8 !text-white/90">
              HomeFeel được xây dựng như một trung tâm dịch vụ chăm sóc cá nhân hiện đại, nơi khách
              hàng có thể chọn dịch vụ, xem thông tin và đặt lịch với cảm giác an tâm ngay từ lần
              đầu sử dụng.
            </Typography.Paragraph>
            <Space size={12} wrap className="mt-4">
              <Link to="/services">
                <Button type="primary" size="large" icon={<CalendarOutlined />}>
                  Xem dịch vụ
                </Button>
              </Link>
              <Link to="/promotions">
                <Button size="large" className="border-white/50 bg-white/90 text-ink">
                  Xem khuyến mãi
                </Button>
              </Link>
            </Space>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-8 px-4 py-14 md:px-8 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <Typography.Text className="!font-semibold uppercase tracking-[0.16em] !text-sage">
            Câu chuyện
          </Typography.Text>
          <Typography.Title level={2} className="!mb-4 !mt-2">
            Từ một thao tác đặt lịch nhỏ đến một trải nghiệm chăm sóc chỉn chu
          </Typography.Title>
          <Typography.Paragraph className="!text-base !leading-8 !text-slate-600">
            Chúng tôi hình dung HomeFeel là nơi mọi thông tin quan trọng đều được đặt đúng chỗ:
            dịch vụ có hình ảnh, giá rõ ràng, thời lượng cụ thể và trạng thái dễ hiểu. Khi khách
            hàng không phải đoán, họ có nhiều không gian hơn để chọn điều phù hợp với mình.
          </Typography.Paragraph>
          <Typography.Paragraph className="!text-base !leading-8 !text-slate-600">
            Với đội ngũ vận hành, hệ thống cũng hướng đến cách quản lý mạch lạc: danh mục, dịch vụ,
            nhân viên, ca làm, đánh giá và khuyến mãi đều có nơi riêng để theo dõi.
          </Typography.Paragraph>
        </div>

        <div className="about-stat-panel">
          <Row gutter={[16, 16]}>
            <Col xs={12}>
              <Statistic title="Dịch vụ mock" value={18} suffix="+" />
            </Col>
            <Col xs={12}>
              <Statistic title="Điểm hài lòng" value={4.8} precision={1} />
            </Col>
            <Col xs={12}>
              <Statistic title="Khung giờ/ngày" value={7} />
            </Col>
            <Col xs={12}>
              <Statistic title="Hỗ trợ lịch" value={24} suffix="/7" />
            </Col>
          </Row>
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-4 py-14 md:px-8">
          <div className="mb-8 max-w-2xl">
            <Typography.Text className="!font-semibold uppercase tracking-[0.16em] !text-sage">
              Điểm khác biệt
            </Typography.Text>
            <Typography.Title level={2} className="!mb-2 !mt-2">
              Thiết kế cho cả khách hàng và đội ngũ vận hành
            </Typography.Title>
          </div>

          <Row gutter={[18, 18]}>
            {valueItems.map((item) => (
              <Col key={item.title} xs={24} md={12} xl={6}>
                <Card className="h-full">
                  <div className="dashboard-icon mb-4">{item.icon}</div>
                  <Typography.Title level={4} className="!mb-2">
                    {item.title}
                  </Typography.Title>
                  <Typography.Text className="!text-slate-500">{item.text}</Typography.Text>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      </section>
    </main>
  );
}
