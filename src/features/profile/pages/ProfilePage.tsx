import { MailOutlined, PhoneOutlined } from '@ant-design/icons';
import { Avatar, Card, Col, Descriptions, Row, Space, Tag, Typography } from 'antd';

import { useAppSelector } from '@/app/redux/hooks';
import { getAvatarInitial } from '@/shared/utils/avatar';

export function ProfilePage() {
  const user = useAppSelector((state) => state.auth.user);

  if (!user) {
    return null;
  }

  return (
    <main className="mx-auto max-w-5xl px-4 py-10 md:px-8">
      <Row gutter={[20, 20]}>
        <Col xs={24} md={8}>
          <Card className="text-center">
            <Avatar size={96} src={user.avatarUrl || undefined}>
              {getAvatarInitial(user.fullName, user.email)}
            </Avatar>
            <Typography.Title level={3} className="!mb-1 !mt-4">
              {user.fullName}
            </Typography.Title>
            <Tag color={user.role === 'ADMIN' ? 'gold' : 'green'}>{user.role}</Tag>
          </Card>
        </Col>
        <Col xs={24} md={16}>
          <Card title="Profile user">
            <Descriptions column={1} bordered>
              <Descriptions.Item label="Họ tên">{user.fullName}</Descriptions.Item>
              <Descriptions.Item label="Email">
                <Space>
                  <MailOutlined />
                  {user.email}
                </Space>
              </Descriptions.Item>
              <Descriptions.Item label="Số điện thoại">
                <Space>
                  <PhoneOutlined />
                  {user.phone || 'Chưa cập nhật'}
                </Space>
              </Descriptions.Item>
              <Descriptions.Item label="Vai trò">{user.role}</Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>
      </Row>
    </main>
  );
}

