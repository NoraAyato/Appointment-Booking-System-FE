import { ArrowLeftOutlined, MailOutlined } from '@ant-design/icons';
import { Button, Form, Input, Typography } from 'antd';

import type { ForgotPasswordPayload } from '../types/auth-type';

interface ForgotPasswordFormProps {
  onSubmit: (values: ForgotPasswordPayload) => void;
  onBackToLogin: () => void;
}

export function ForgotPasswordForm({ onSubmit, onBackToLogin }: ForgotPasswordFormProps) {
  return (
    <>
      <div className="mb-5">
        <Typography.Title level={3} className="!mb-1">
          Quên mật khẩu
        </Typography.Title>
        <Typography.Text className="text-slate-500">
          Nhập email để nhận hướng dẫn đặt lại mật khẩu khi API sẵn sàng.
        </Typography.Text>
      </div>

      <Form<ForgotPasswordPayload> key="forgot-password-form" layout="vertical" onFinish={onSubmit}>
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

        <Button block type="primary" htmlType="submit" icon={<MailOutlined />}>
          Tiếp tục
        </Button>

        <Button block className="mt-3" icon={<ArrowLeftOutlined />} onClick={onBackToLogin}>
          Trở lại đăng nhập
        </Button>
      </Form>
    </>
  );
}

