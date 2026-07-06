import { LockOutlined } from '@ant-design/icons';
import { Button, Card, Form, Input, Result, Typography, notification } from 'antd';
import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';

import { authApi } from '../api/auth-api';
import type { ResetPasswordPayload } from '../types/auth-type';
import { getApiErrorMessage } from '@/shared/utils/api-error';

interface ResetPasswordFormValues {
  newPassword: string;
  rePassword: string;
}

export function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const [toast, toastContextHolder] = notification.useNotification();
  const [submitting, setSubmitting] = useState(false);
  const [completed, setCompleted] = useState(false);
  const resetToken = searchParams.get('resetToken') ?? '';

  const handleSubmit = async (values: ResetPasswordFormValues) => {
    const payload: ResetPasswordPayload = {
      token: resetToken,
      newPassword: values.newPassword,
    };

    setSubmitting(true);

    try {
      const response = await authApi.resetPassword(payload);

      if (!response.success) {
        throw new Error(response.message || 'Không thể đặt lại mật khẩu.');
      }

      setCompleted(true);
    } catch (error) {
      toast.error({
        message: 'Đặt lại mật khẩu thất bại',
        description: getApiErrorMessage(error, 'Liên kết không hợp lệ hoặc đã hết hạn.'),
        placement: 'topRight',
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (!resetToken) {
    return (
      <main className="grid min-h-screen place-items-center bg-[#f7f4ee] px-4 py-10">
        <Result
          status="warning"
          title="Thiếu mã đặt lại mật khẩu"
          subTitle="Vui lòng mở đúng liên kết được gửi trong email."
          extra={
            <Link to="/">
              <Button type="primary">Về trang chủ</Button>
            </Link>
          }
        />
      </main>
    );
  }

  if (completed) {
    return (
      <main className="grid min-h-screen place-items-center bg-[#f7f4ee] px-4 py-10">
        <Result
          status="success"
          title="Đã đặt lại mật khẩu"
          subTitle="Bạn có thể đăng nhập bằng mật khẩu mới."
          extra={
            <Link to="/">
              <Button type="primary">Về trang chủ</Button>
            </Link>
          }
        />
      </main>
    );
  }

  return (
    <main className="grid min-h-screen place-items-center bg-[#f7f4ee] px-4 py-10">
      {toastContextHolder}

      <Card className="w-full max-w-md">
        <div className="mb-5">
          <Typography.Title level={3} className="!mb-1">
            Đặt lại mật khẩu
          </Typography.Title>
          <Typography.Text className="text-slate-500">
            Nhập mật khẩu mới cho tài khoản của bạn.
          </Typography.Text>
        </div>

        <Form<ResetPasswordFormValues> layout="vertical" requiredMark={false} onFinish={handleSubmit}>
          <Form.Item
            name="newPassword"
            label="Mật khẩu mới"
            rules={[
              { required: true, message: 'Vui lòng nhập mật khẩu mới.' },
              { min: 6, message: 'Mật khẩu tối thiểu 6 kí tự.' },
              { max: 10, message: 'Mật khẩu tối đa 10 kí tự.' },
            ]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="Mật khẩu mới" maxLength={10} />
          </Form.Item>

          <Form.Item
            name="rePassword"
            label="Nhập lại mật khẩu"
            dependencies={['newPassword']}
            rules={[
              { required: true, message: 'Vui lòng nhập lại mật khẩu.' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('newPassword') === value) {
                    return Promise.resolve();
                  }

                  return Promise.reject(new Error('Mật khẩu nhập lại không khớp.'));
                },
              }),
            ]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="Nhập lại mật khẩu" maxLength={10} />
          </Form.Item>

          <Button block type="primary" htmlType="submit" loading={submitting}>
            Cập nhật mật khẩu
          </Button>
        </Form>
      </Card>
    </main>
  );
}
