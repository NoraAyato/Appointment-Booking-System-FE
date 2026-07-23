import { ArrowLeftOutlined, GoogleOutlined, MailOutlined, UserAddOutlined } from '@ant-design/icons';
import { Alert, Button, Divider, Form, Input, Space, Typography } from 'antd';
import { useState } from 'react';

import type { RegisterPayload, VerifyOtpPayload } from '../types/auth-type';

interface RegisterFormProps {
  error: string | null;
  loading: boolean;
  onSendOtp: (email: string) => Promise<void>;
  onVerifyOtp: (values: VerifyOtpPayload) => Promise<void>;
  onSubmit: (values: RegisterPayload) => void;
  onLogin: () => void;
  onGoogleLogin: () => void;
}

export function RegisterForm({
  error,
  loading,
  onSendOtp,
  onVerifyOtp,
  onSubmit,
  onLogin,
  onGoogleLogin,
}: RegisterFormProps) {
  const [form] = Form.useForm<RegisterPayload & { otp?: string }>();
  const [otpSent, setOtpSent] = useState(false);

  const handleSubmit = async (values: RegisterPayload & { otp?: string }) => {
    if (!otpSent) {
      await onSendOtp(values.email);
      setOtpSent(true);
      return;
    }

    await onVerifyOtp({ email: values.email, otp: values.otp ?? '' });
    onSubmit(values);
  };

  const handleEditInfo = () => {
    setOtpSent(false);
    form.setFieldValue('otp', undefined);
  };

  return (
    <>
      <div className="mb-5">
        <Typography.Title level={3} className="!mb-1">
          Đăng kí
        </Typography.Title>
        <Typography.Text className="text-slate-500">
          Tạo tài khoản bằng email đã xác thực OTP.
        </Typography.Text>
      </div>

      {error ? <Alert className="mb-4" type="error" message={error} showIcon /> : null}

      {otpSent ? (
        <Alert
          className="mb-4"
          type="success"
          message="Mã OTP đã được gửi"
          description="Kiểm tra email và nhập mã OTP để hoàn tất đăng kí."
          showIcon
        />
      ) : null}

      <Form<RegisterPayload & { otp?: string }>
        form={form}
        key="register-form"
        layout="vertical"
        onFinish={handleSubmit}
      >
        <Form.Item
          name="email"
          label="Email"
          rules={[
            { required: true, message: 'Vui lòng nhập email.' },
            { type: 'email', message: 'Email không hợp lệ.' },
          ]}
        >
          <Input disabled={otpSent} placeholder="you@example.com" />
        </Form.Item>

        <Form.Item
          name="password"
          label="Mật khẩu"
          rules={[
            { required: true, message: 'Vui lòng nhập mật khẩu.' },
            { min: 6, message: 'Mật khẩu tối thiểu 6 kí tự.' },
            { max: 10, message: 'Mật khẩu tối đa 10 kí tự.' },
          ]}
        >
          <Input.Password disabled={otpSent} placeholder="Tạo mật khẩu" maxLength={10} />
        </Form.Item>

        <Form.Item
          name="repeatPassword"
          label="Nhập lại mật khẩu"
          dependencies={['password']}
          rules={[
            { required: true, message: 'Vui lòng nhập lại mật khẩu.' },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('password') === value) {
                  return Promise.resolve();
                }

                return Promise.reject(new Error('Mật khẩu nhập lại không khớp.'));
              },
            }),
          ]}
        >
          <Input.Password disabled={otpSent} placeholder="Nhập lại mật khẩu" maxLength={10} />
        </Form.Item>

        <Space className="w-full" size={12} align="start">
          <Form.Item
            className="flex-1"
            name="lastName"
            label="Họ"
            rules={[
              { required: true, message: 'Vui lòng nhập họ.' },
              { min: 3, message: 'Họ tối thiểu 3 kí tự.' },
              { max: 6, message: 'Họ tối đa 6 kí tự.' },
            ]}
          >
            <Input disabled={otpSent} placeholder="Nguyễn" maxLength={6} />
          </Form.Item>
          <Form.Item
            className="flex-1"
            name="firstName"
            label="Tên"
            rules={[
              { required: true, message: 'Vui lòng nhập tên.' },
              { min: 3, message: 'Tên tối thiểu 3 kí tự.' },
              { max: 6, message: 'Tên tối đa 6 kí tự.' },
            ]}
          >
            <Input disabled={otpSent} placeholder="Minh" maxLength={6} />
          </Form.Item>
        </Space>

        {otpSent ? (
          <Form.Item
            name="otp"
            label="Mã OTP"
            rules={[{ required: true, message: 'Vui lòng nhập mã OTP.' }]}
          >
            <Input placeholder="Nhập mã OTP" maxLength={6} />
          </Form.Item>
        ) : null}

        <Button
          block
          type="primary"
          htmlType="submit"
          loading={loading}
          icon={otpSent ? <UserAddOutlined /> : <MailOutlined />}
        >
          {otpSent ? 'Xác thực OTP và đăng kí' : 'Gửi OTP'}
        </Button>

        {otpSent ? (
          <Button block className="mt-3" icon={<ArrowLeftOutlined />} onClick={handleEditInfo}>
            Sửa thông tin
          </Button>
        ) : null}
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
