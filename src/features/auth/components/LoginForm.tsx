import { GoogleOutlined, LoginOutlined } from '@ant-design/icons';
import { Alert, Button, Checkbox, Divider, Form, Input, Typography } from 'antd';

import type { LoginPayload } from '../types/auth-type';

interface LoginFormProps {
  error: string | null;
  loading: boolean;
  onSubmit: (values: LoginPayload) => void;
  onForgotPassword: () => void;
  onRegister: () => void;
  onGoogleLogin: () => void;
}

export function LoginForm({
  error,
  loading,
  onSubmit,
  onForgotPassword,
  onRegister,
  onGoogleLogin,
}: LoginFormProps) {
  return (
    <>
      <div className="mb-5">
        <Typography.Title level={3} className="!mb-1">
          Đăng nhập
        </Typography.Title>
        <Typography.Text className="text-slate-500">
          Truy cập tài khoản để quản lý lịch đặt dịch vụ của bạn.
        </Typography.Text>
      </div>

      {error ? <Alert className="mb-4" type="error" message={error} showIcon /> : null}

      <Form<LoginPayload>
        key="login-form"
        layout="vertical"
        initialValues={{ rememberMe: false }}
        onFinish={onSubmit}
      >
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
          <Input.Password placeholder="Nhập mật khẩu" />
        </Form.Item>

        <div className="mb-5 flex items-center justify-between gap-3">
          <Form.Item name="rememberMe" valuePropName="checked" noStyle>
            <Checkbox>Ghi nhớ tôi</Checkbox>
          </Form.Item>
          <Button type="link" className="px-0" onClick={onForgotPassword}>
            Quên mật khẩu?
          </Button>
        </div>

        <Button block type="primary" htmlType="submit" loading={loading} icon={<LoginOutlined />}>
          Đăng nhập
        </Button>
      </Form>

      <Divider plain>hoặc</Divider>

      <Button block icon={<GoogleOutlined />} onClick={onGoogleLogin}>
        Tiếp tục với Google
      </Button>

      <div className="mt-5 text-center text-sm text-slate-500">
        Chưa có tài khoản?{' '}
        <Button type="link" className="px-1" onClick={onRegister}>
          Đăng kí
        </Button>
      </div>
    </>
  );
}
