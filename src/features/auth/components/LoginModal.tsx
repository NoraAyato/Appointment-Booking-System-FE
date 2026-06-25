import { LoginOutlined, UserSwitchOutlined } from '@ant-design/icons';
import { Alert, Button, Form, Input, Modal, Segmented, Typography } from 'antd';
import type { SegmentedValue } from 'antd/es/segmented';
import { useEffect } from 'react';

import { useAppDispatch, useAppSelector } from '@/app/redux/hooks';

import { clearAuthError, login } from '../store/auth-slice';
import type { LoginPayload, UserRole } from '../types/auth-type';

interface LoginModalProps {
  open: boolean;
  onClose: () => void;
}

const roleOptions: Array<{ label: string; value: UserRole }> = [
  { label: 'Khách hàng', value: 'customer' },
  { label: 'Staff', value: 'staff' },
  { label: 'Admin', value: 'admin' },
];

const demoEmailByRole: Record<UserRole, string> = {
  customer: 'customer@yoedu.vn',
  staff: 'staff@yoedu.vn',
  admin: 'admin@yoedu.vn',
};

export function LoginModal({ open, onClose }: LoginModalProps) {
  const [form] = Form.useForm<LoginPayload>();
  const dispatch = useAppDispatch();
  const { loading, error, user } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (open) {
      form.setFieldsValue({
        role: 'customer',
        email: demoEmailByRole.customer,
        password: '123456',
      });
      dispatch(clearAuthError());
    }
  }, [dispatch, form, open]);

  useEffect(() => {
    if (user && open) {
      onClose();
    }
  }, [onClose, open, user]);

  const handleRoleChange = (value: SegmentedValue) => {
    const role = value as UserRole;
    form.setFieldsValue({
      role,
      email: demoEmailByRole[role],
      password: '123456',
    });
  };

  const handleFinish = (values: LoginPayload) => {
    dispatch(login(values));
  };

  return (
    <Modal
      title={
        <div className="flex items-center gap-2">
          <UserSwitchOutlined className="text-sage" />
          <span>Đăng nhập YoEdu</span>
        </div>
      }
      open={open}
      onCancel={onClose}
      footer={null}
      width={440}
      destroyOnHidden
    >
      <Typography.Paragraph className="!mb-5 !text-slate-500">
        Chọn vai trò mock để xem dropdown và dashboard tương ứng.
      </Typography.Paragraph>

      {error ? (
        <Alert className="mb-4" type="error" message={error} showIcon />
      ) : null}

      <Form form={form} layout="vertical" onFinish={handleFinish}>
        <Form.Item name="role" label="Vai trò">
          <Segmented block options={roleOptions} onChange={handleRoleChange} />
        </Form.Item>

        <Form.Item
          name="email"
          label="Email"
          rules={[{ required: true, message: 'Vui lòng nhập email.' }]}
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

        <Button block type="primary" htmlType="submit" loading={loading} icon={<LoginOutlined />}>
          Đăng nhập
        </Button>
      </Form>
    </Modal>
  );
}
