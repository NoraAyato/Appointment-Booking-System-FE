import { GiftOutlined, PercentageOutlined, ThunderboltOutlined } from '@ant-design/icons';
import { Button, Card, Col, Row, Space, Tag, Typography } from 'antd';

const promotions = [
  {
    id: 'promo-01',
    title: 'Wellness Starter',
    value: 'Giảm 20%',
    description: 'Áp dụng cho lần đặt lịch đầu tiên trong nhóm dịch vụ wellness.',
    icon: <GiftOutlined />,
    color: '#2f7d67',
  },
  {
    id: 'promo-02',
    title: 'Combo tư vấn tháng',
    value: 'Tiết kiệm 150K',
    description: 'Dành cho khách đặt từ 2 buổi tư vấn trong cùng tháng.',
    icon: <PercentageOutlined />,
    color: '#de7d62',
  },
  {
    id: 'promo-03',
    title: 'Khung giờ nhanh',
    value: 'Ưu tiên xác nhận',
    description: 'Các lịch trống trong 24 giờ tới được staff xác nhận ưu tiên.',
    icon: <ThunderboltOutlined />,
    color: '#d99530',
  },
];

export function PromotionsPage() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-10 md:px-8">
      <Typography.Title level={2}>Khuyến mãi</Typography.Title>
      <Typography.Text className="text-slate-500">
        Các ưu đãi mock để hoàn thiện luồng menu user và trang nội dung.
      </Typography.Text>

      <Row gutter={[20, 20]} className="mt-6">
        {promotions.map((promotion) => (
          <Col key={promotion.id} xs={24} md={8}>
            <Card className="h-full">
              <Space direction="vertical" size={14}>
                <div className="promo-icon" style={{ color: promotion.color }}>
                  {promotion.icon}
                </div>
                <Tag color={promotion.color}>{promotion.value}</Tag>
                <Typography.Title level={3} className="!mb-0">
                  {promotion.title}
                </Typography.Title>
                <Typography.Text className="text-slate-500">{promotion.description}</Typography.Text>
                <Button type="default">Xem ưu đãi</Button>
              </Space>
            </Card>
          </Col>
        ))}
      </Row>
    </main>
  );
}
