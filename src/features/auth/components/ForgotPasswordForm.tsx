import { ArrowLeftOutlined, MailOutlined } from '@ant-design/icons';
import { Alert, Button, Form, Input, Typography } from 'antd';

import type { ForgotPasswordPayload } from '../types/auth-type';

interface ForgotPasswordFormProps {
  error: string | null;
  loading: boolean;
  sent: boolean;
  onSubmit: (values: ForgotPasswordPayload) => void;
  onBackToLogin: () => void;
}

export function ForgotPasswordForm({
  error,
  loading,
  sent,
  onSubmit,
  onBackToLogin,
}: ForgotPasswordFormProps) {
  return (
    <>
      <div className="mb-5">
        <Typography.Title level={3} className="!mb-1">
          Quên mật khẩu
        </Typography.Title>
        <Typography.Text className="text-slate-500">
          Nhập email để nhận liên kết đặt lại mật khẩu.
        </Typography.Text>
      </div>

      {error ? <Alert className="mb-4" type="error" message={error} showIcon /> : null}

      {sent ? (
        <Alert
          className="mb-4"
          type="success"
          message="Đã gửi email đặt lại mật khẩu"
          description="Vui lòng kiểm tra hộp thư và mở liên kết reset password."
          showIcon
        />
      ) : null}

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

        <Button block type="primary" htmlType="submit" loading={loading} icon={<MailOutlined />}>
          Gửi liên kết
        </Button>

        <Button block className="mt-3" icon={<ArrowLeftOutlined />} onClick={onBackToLogin}>
          Trở lại đăng nhập
        </Button>
      </Form>
    </>
  );
}
