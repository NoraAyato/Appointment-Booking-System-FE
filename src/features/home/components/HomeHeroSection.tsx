import { ArrowRightOutlined, CheckCircleFilled } from '@ant-design/icons';
import { Button, Space, Typography } from 'antd';
import { Link } from 'react-router-dom';

import heroImage from '@/assets/appointment-hero.png';
import { APP_BRAND } from '@/shared/constants/brand';

export function HomeHeroSection() {
  return (
    <section className="hero-section" style={{ backgroundImage: `url(${heroImage})` }}>
      <div className="hero-overlay">
        <div className="mx-auto flex min-h-[560px] max-w-7xl flex-col justify-center px-4 py-10 md:min-h-[620px] md:px-8 lg:py-14">
          <Space className="mb-4 w-fit rounded-full bg-white/85 px-4 py-2 text-sage shadow-sm">
            <CheckCircleFilled />
            <span className="font-semibold">Đặt lịch chăm sóc rõ ràng, nhẹ nhàng, đúng giờ</span>
          </Space>

          <Typography.Title className="hero-title !mb-5 !text-white">
            {APP_BRAND.name} cho những lịch hẹn chăm sóc tại trung tâm tinh tế hơn
          </Typography.Title>
          <Typography.Paragraph className="max-w-2xl !text-lg !leading-8 !text-white/90">
            Khám phá dịch vụ, chọn ngày giờ phù hợp và để HomeFeel giúp bạn kết nối với đội ngũ
            chăm sóc tại trung tâm một cách rõ ràng.
          </Typography.Paragraph>

          <Space size={12} wrap className="mt-4">
            <Link to="/services">
              <Button type="primary" size="large" icon={<ArrowRightOutlined />}>
                Bắt đầu
              </Button>
            </Link>
            <Link to="/about">
              <Button size="large" className="border-white/50 bg-white/90 text-ink">
                Về chúng tôi
              </Button>
            </Link>
          </Space>
        </div>
      </div>
    </section>
  );
}
