import { BarChartOutlined, TeamOutlined, WalletOutlined } from '@ant-design/icons';
import { Card, Col, Progress, Row, Space, Typography } from 'antd';

import { DataTable } from '@/shared/components/DataTable';

import { DashboardPage } from '../components/DashboardPage';

const serviceStats = [
  { key: 'srv-01', service: 'Tư vấn sức khỏe tổng quát', bookings: 132, revenue: '46.2M' },
  { key: 'srv-02', service: 'Chăm sóc da chuyên sâu', bookings: 98, revenue: '50.9M' },
  { key: 'srv-04', service: 'Vật lý trị liệu', bookings: 74, revenue: '48.1M' },
];

export function AdminDashboardPage() {
  return (
    <DashboardPage
      title="Thống kê"
      description="Theo dõi vận hành, doanh thu mock và hiệu suất dịch vụ."
    >
      <Row gutter={[18, 18]}>
        <Col xs={24} md={8}>
          <Card>
            <Space>
              <WalletOutlined className="dashboard-icon" />
              <div>
                <Typography.Text className="text-slate-500">Doanh thu tháng</Typography.Text>
                <Typography.Title level={3} className="!mb-0">
                  145.2M
                </Typography.Title>
              </div>
            </Space>
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card>
            <Space>
              <TeamOutlined className="dashboard-icon blue" />
              <div>
                <Typography.Text className="text-slate-500">Khách hàng</Typography.Text>
                <Typography.Title level={3} className="!mb-0">
                  1,284
                </Typography.Title>
              </div>
            </Space>
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card>
            <Space>
              <BarChartOutlined className="dashboard-icon amber" />
              <div>
                <Typography.Text className="text-slate-500">Tỉ lệ lấp lịch</Typography.Text>
                <Progress percent={82} showInfo={false} strokeColor="#2f7d67" />
              </div>
            </Space>
          </Card>
        </Col>
      </Row>

      <DataTable
        rowKey="key"
        dataSource={serviceStats}
        title="Hiệu suất dịch vụ"
        columns={[
          { title: 'Dịch vụ', dataIndex: 'service' },
          { title: 'Lượt đặt', dataIndex: 'bookings' },
          { title: 'Doanh thu', dataIndex: 'revenue' },
        ]}
      />
    </DashboardPage>
  );
}