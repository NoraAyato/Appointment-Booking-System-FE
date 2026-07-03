import { CalendarOutlined, CheckCircleOutlined, ClockCircleOutlined } from '@ant-design/icons';
import { Card, Col, Row, Space, Tag, Typography } from 'antd';

import { DataTable } from '@/shared/components/DataTable';

import { DashboardPage } from '../components/DashboardPage';

const todayQueue = [
  { id: 'apt-1004', customer: 'Minh Anh', service: 'Chăm sóc da chuyên sâu', time: '09:30' },
  { id: 'apt-1008', customer: 'Quốc Huy', service: 'Tư vấn tổng quát', time: '11:00' },
  { id: 'apt-1011', customer: 'Mai Chi', service: 'Vật lý trị liệu', time: '15:30' },
];

export function StaffDashboardPage() {
  return (
    <DashboardPage
      title="Lịch làm việc"
      description="Tổng quan ca hẹn, hàng chờ và trạng thái xử lý trong ngày."
    >
      <Row gutter={[18, 18]}>
        <Col xs={24} md={8}>
          <Card>
            <Space>
              <CalendarOutlined className="dashboard-icon" />
              <div>
                <Typography.Text className="text-slate-500">Lịch hôm nay</Typography.Text>
                <Typography.Title level={3} className="!mb-0">
                  12
                </Typography.Title>
              </div>
            </Space>
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card>
            <Space>
              <ClockCircleOutlined className="dashboard-icon amber" />
              <div>
                <Typography.Text className="text-slate-500">Đang chờ</Typography.Text>
                <Typography.Title level={3} className="!mb-0">
                  4
                </Typography.Title>
              </div>
            </Space>
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card>
            <Space>
              <CheckCircleOutlined className="dashboard-icon blue" />
              <div>
                <Typography.Text className="text-slate-500">Hoàn tất</Typography.Text>
                <Typography.Title level={3} className="!mb-0">
                  8
                </Typography.Title>
              </div>
            </Space>
          </Card>
        </Col>
      </Row>

      <DataTable
        rowKey="id"
        dataSource={todayQueue}
        title="Hàng chờ hôm nay"
        columns={[
          { title: 'Mã lịch', dataIndex: 'id' },
          { title: 'Khách hàng', dataIndex: 'customer' },
          { title: 'Dịch vụ', dataIndex: 'service' },
          { title: 'Giờ', dataIndex: 'time' },
          { title: 'Trạng thái', render: () => <Tag color="green">ready</Tag> },
        ]}
      />
    </DashboardPage>
  );
}