import {
  ClockCircleOutlined,
  HeartOutlined,
  SafetyCertificateOutlined,
  TeamOutlined,
} from '@ant-design/icons';
import { Card, Col, Row, Typography } from 'antd';
import type { ReactNode } from 'react';

import { homeAboutValues } from '../constants/home-mock-data';
import type { HomeAboutValue } from '../types/home-type';

const aboutValueIcon: Record<HomeAboutValue['iconType'], ReactNode> = {
  clock: <ClockCircleOutlined />,
  heart: <HeartOutlined />,
  safety: <SafetyCertificateOutlined />,
  team: <TeamOutlined />,
};

export function HomeAboutPreviewSection() {
  return (
    <section id="about" className="bg-white">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-14 md:px-8 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <Typography.Text className="!font-semibold uppercase tracking-[0.16em] !text-sage">
            Về HomeFeel
          </Typography.Text>
          <Typography.Title level={2} className="!mb-4 !mt-2">
            Trải nghiệm đặt lịch được thiết kế cho cảm giác an tâm
          </Typography.Title>
          <Typography.Paragraph className="!text-base !leading-8 !text-slate-600">
            HomeFeel tập trung vào những dịch vụ chăm sóc cá nhân có lịch hẹn rõ ràng, thông tin
            dễ so sánh và đội ngũ được phân công theo từng nhu cầu. Trước khi kết nối API thật,
            giao diện đang được hoàn thiện để người dùng có thể chọn dịch vụ một cách tự nhiên.
          </Typography.Paragraph>
        </div>

        <Row gutter={[16, 16]}>
          {homeAboutValues.map((item) => (
            <Col key={item.title} xs={24} md={12}>
              <Card className="h-full">
                <div className="dashboard-icon mb-4">{aboutValueIcon[item.iconType]}</div>
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
  );
}
