import { GoogleOutlined, UserAddOutlined } from '@ant-design/icons';
import { Alert, Button, Divider, Form, Input, Space, Typography } from 'antd';

import type { RegisterPayload } from '../types/auth-type';

interface RegisterFormProps {
  error: string | null;
  loading: boolean;
  onSubmit: (values: RegisterPayload) => void;
  onLogin: () => void;
  onGoogleLogin: () => void;
}

export function RegisterForm({
  error,
  loading,
  onSubmit,
  onLogin,
  onGoogleLogin,
}: RegisterFormProps) {
  return (
    <>
      <div className="mb-5">
        <Typography.Title level={3} className="!mb-1">
          Đăng kí
        </Typography.Title>
        <Typography.Text className="text-slate-500">
          Tạo tài khoản để đặt lịch và theo dõi lịch sử dịch vụ.
        </Typography.Text>
      </div>

      {error ? <Alert className="mb-4" type="error" message={error} showIcon /> : null}

      <Form<RegisterPayload> key="register-form" layout="vertical" onFinish={onSubmit}>
        <Form.Item
          name="email"
          label="Email"
          rules={[
            { required: true, message: 'Vui lòng nhập email.' },
            { type: 'email', message: 'Email không hợp lệ.' },
          ]}
        >
          <Input placeholder="you@example.com" />
        </Form.Item>

        <Form.Item
          name="password"
          label="Mật khẩu"
          rules={[{ required: true, message: 'Vui lòng nhập mật khẩu.' }]}
        >
          <Input.Password placeholder="Tạo mật khẩu" />
        </Form.Item>

        <Space className="w-full" size={12} align="start">
          <Form.Item
            className="flex-1"
            name="lastName"
            label="Họ"
            rules={[{ required: true, message: 'Vui lòng nhập họ.' }]}
          >
            <Input placeholder="Nguyễn" />
          </Form.Item>
          <Form.Item
            className="flex-1"
            name="firstName"
            label="Tên"
            rules={[{ required: true, message: 'Vui lòng nhập tên.' }]}
          >
            <Input placeholder="An" />
          </Form.Item>
        </Space>

        <Button block type="primary" htmlType="submit" loading={loading} icon={<UserAddOutlined />}>
          Đăng kí
        </Button>
      </Form>

      <Divider plain>hoặc</Divider>

      <Button block icon={<GoogleOutlined />} onClick={onGoogleLogin}>
        Tiếp tục với Google
      </Button>

      <div className="mt-5 text-center text-sm text-slate-500">
        Bạn đã có tài khoản?{' '}
        <Button type="link" className="px-1" onClick={onLogin}>
          Đăng nhập
        </Button>
      </div>
    </>
  );
}
