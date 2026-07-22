import {
  CameraOutlined,
  CheckCircleOutlined,
  IdcardOutlined,
  LockOutlined,
  MailOutlined,
  PhoneOutlined,
  SafetyCertificateOutlined,
  UserOutlined,
} from '@ant-design/icons';
import {
  Avatar,
  Button,
  Card,
  Col,
  Divider,
  Form,
  Input,
  Radio,
  Row,
  Space,
  Tag,
  Tabs,
  Typography,
  notification,
} from 'antd';
import { useEffect, useMemo, useRef, useState } from 'react';

import { useAppDispatch, useAppSelector } from '@/app/redux/hooks';
import { authApi } from '@/features/auth/api/auth-api';
import { userApi } from '@/features/users/api/user-api';
import { getUserRoleMeta, getUserStatusMeta } from '@/features/users/constants/user-display';
import { fetchCurrentUser } from '@/features/users/store/user-thunk';
import type { ChangePasswordPayload } from '@/features/auth/types/auth-type';
import type { UpdateUserProfilePayload } from '@/features/users/types/user-type';
import { getApiErrorMessage } from '@/shared/utils/api-error';
import { getAssetUrl } from '@/shared/utils/asset-url';
import { getAvatarInitial } from '@/shared/utils/avatar';

const PHONE_NUMBER_PATTERN = /^(03|05|07|08|09)\d{8}$/;

type ChangePasswordFormValues = ChangePasswordPayload;

const getGenderText = (gender?: boolean) => {
  if (gender === true) {
    return 'Nam';
  }

  if (gender === false) {
    return 'Nữ';
  }

  return 'Chưa cập nhật';
};

export function ProfilePage() {
  const [form] = Form.useForm<UpdateUserProfilePayload>();
  const [passwordForm] = Form.useForm<ChangePasswordFormValues>();
  const [toast, toastContextHolder] = notification.useNotification();
  const [submitting, setSubmitting] = useState(false);
  const [passwordSubmitting, setPasswordSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.users.currentUser);
  const profileValues = Form.useWatch([], form) as Partial<UpdateUserProfilePayload> | undefined;
  const passwordValues = Form.useWatch([], passwordForm) as Partial<ChangePasswordFormValues> | undefined;

  const hasProfileChanges = useMemo(() => {
    if (!user || !profileValues) {
      return false;
    }

    return (
      (profileValues.firstName ?? '') !== (user.firstName ?? '') ||
      (profileValues.lastName ?? '') !== (user.lastName ?? '') ||
      (profileValues.phoneNumber ?? '') !== (user.phone ?? '') ||
      (profileValues.gender ?? true) !== (user.gender ?? true)
    );
  }, [profileValues, user]);

  const canSubmitPassword = useMemo(() => {
    const currentPassword = passwordValues?.currentPassword?.trim() ?? '';
    const newPassword = passwordValues?.newPassword?.trim() ?? '';
    const rePassword = passwordValues?.rePassword?.trim() ?? '';

    return Boolean(
      currentPassword &&
        newPassword &&
        rePassword &&
        newPassword !== currentPassword &&
        newPassword === rePassword,
    );
  }, [passwordValues]);

  useEffect(() => {
    if (!user) {
      return;
    }

    form.setFieldsValue({
      firstName: user.firstName ?? '',
      gender: user.gender ?? true,
      lastName: user.lastName ?? '',
      phoneNumber: user.phone ?? '',
    });
  }, [form, user]);

  if (!user) {
    return null;
  }

  const avatarUrl = getAssetUrl(user.avatarUrl);
  const roleMeta = getUserRoleMeta(user.role);
  const statusMeta = getUserStatusMeta(user.status);

  const handleSubmit = async (values: UpdateUserProfilePayload) => {
    setSubmitting(true);

    try {
      const response = await userApi.updateProfile(values);

      if (!response.success) {
        throw new Error(response.message || 'Không thể cập nhật hồ sơ.');
      }

      await dispatch(fetchCurrentUser()).unwrap();
      toast.success({
        message: 'Cập nhật hồ sơ thành công',
        description: response.message,
        placement: 'topRight',
      });
    } catch (error) {
      toast.error({
        message: 'Cập nhật hồ sơ thất bại',
        description: getApiErrorMessage(error, 'Vui lòng kiểm tra thông tin và thử lại.'),
        placement: 'topRight',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleChangePassword = async (values: ChangePasswordFormValues) => {
    setPasswordSubmitting(true);

    try {
      const response = await authApi.changePassword(values);

      if (!response.success) {
        throw new Error(response.message || 'Không thể đổi mật khẩu.');
      }

      passwordForm.resetFields();
      toast.success({
        message: 'Đổi mật khẩu thành công',
        description: response.message,
        placement: 'topRight',
      });
    } catch (error) {
      toast.error({
        message: 'Đổi mật khẩu thất bại',
        description: getApiErrorMessage(error, 'Vui lòng kiểm tra mật khẩu hiện tại và thử lại.'),
        placement: 'topRight',
      });
    } finally {
      setPasswordSubmitting(false);
    }
  };

  const handleAvatarClick = () => {
    if (uploading) {
      return;
    }

    fileInputRef.current?.click();
  };

  const handleAvatarChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const [file] = Array.from(event.target.files ?? []);

    event.target.value = '';

    if (!file) {
      return;
    }

    if (!file.type.startsWith('image/')) {
      toast.error({
        message: 'Ảnh đại diện không hợp lệ',
        description: 'Vui lòng chọn file hình ảnh.',
        placement: 'topRight',
      });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error({
        message: 'Ảnh đại diện quá lớn',
        description: 'Vui lòng chọn ảnh không vượt quá 5MB.',
        placement: 'topRight',
      });
      return;
    }

    setUploading(true);

    try {
      const response = await userApi.updateImage(file);

      if (!response.success) {
        throw new Error(response.message || 'Không thể cập nhật ảnh đại diện.');
      }

      await dispatch(fetchCurrentUser()).unwrap();
      toast.success({
        message: 'Cập nhật ảnh đại diện thành công',
        description: response.message,
        placement: 'topRight',
      });
    } catch (error) {
      toast.error({
        message: 'Cập nhật ảnh đại diện thất bại',
        description: getApiErrorMessage(error, 'Vui lòng thử lại sau.'),
        placement: 'topRight',
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <main className="bg-[#f7f4ee] px-4 py-8 md:px-8 md:py-12">
      {toastContextHolder}

      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex flex-col gap-2">
          <Typography.Text className="!font-semibold uppercase tracking-[0.18em] !text-sage">
            Hồ sơ cá nhân
          </Typography.Text>
          <Typography.Title level={2} className="!mb-0 !text-ink">
            Quản lý thông tin tài khoản
          </Typography.Title>
          <Typography.Text className="max-w-2xl !text-slate-500">
            Cập nhật thông tin liên hệ để HomeFeel hỗ trợ lịch hẹn và thông báo dịch vụ chính
            xác hơn.
          </Typography.Text>
        </div>

        <Row gutter={[24, 24]} align="stretch">
          <Col xs={24} lg={8}>
            <Card className="h-full overflow-hidden">
              <div className="-mx-6 -mt-6 h-32 bg-[linear-gradient(135deg,#214f45_0%,#2f7d67_48%,#f4c46b_100%)]" />
              <div className="-mt-16 flex flex-col items-center px-2 text-center">
                <button
                  type="button"
                  className="group relative rounded-full border-4 border-white bg-white shadow-soft"
                  onClick={handleAvatarClick}
                  aria-label="Cập nhật ảnh đại diện"
                >
                  <Avatar size={128} src={avatarUrl} className="!bg-sage !text-4xl">
                    {getAvatarInitial(user.fullName, user.email)}
                  </Avatar>
                  <span className="absolute inset-x-0 bottom-0 flex h-10 items-center justify-center rounded-b-full bg-black/55 text-white opacity-0 transition group-hover:opacity-100">
                    <CameraOutlined />
                  </span>
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarChange}
                />

                <Typography.Title level={3} className="!mb-1 !mt-5 !text-ink">
                  {user.fullName || user.email}
                </Typography.Title>
                <Space size={8} wrap className="justify-center">
                  <Tag color={roleMeta.color}>{roleMeta.label}</Tag>
                  {statusMeta ? <Tag color={statusMeta.color}>{statusMeta.label}</Tag> : null}
                </Space>

                <Button
                  className="mt-5"
                  icon={<CameraOutlined />}
                  loading={uploading}
                  onClick={handleAvatarClick}
                >
                  Đổi ảnh đại diện
                </Button>
              </div>

              <Divider />

              <Space direction="vertical" size={14} className="w-full">
                <div className="flex items-start gap-3 rounded-lg bg-slate-50 p-3">
                  <MailOutlined className="mt-1 text-sage" />
                  <div className="min-w-0">
                    <Typography.Text className="block !text-xs !font-semibold uppercase !text-slate-400">
                      Email
                    </Typography.Text>
                    <Typography.Text className="block truncate !font-semibold !text-ink">
                      {user.email}
                    </Typography.Text>
                  </div>
                </div>

                <div className="flex items-start gap-3 rounded-lg bg-slate-50 p-3">
                  <PhoneOutlined className="mt-1 text-sage" />
                  <div>
                    <Typography.Text className="block !text-xs !font-semibold uppercase !text-slate-400">
                      Số điện thoại
                    </Typography.Text>
                    <Typography.Text className="!font-semibold !text-ink">
                      {user.phone || 'Chưa cập nhật'}
                    </Typography.Text>
                  </div>
                </div>

                <div className="flex items-start gap-3 rounded-lg bg-slate-50 p-3">
                  <UserOutlined className="mt-1 text-sage" />
                  <div>
                    <Typography.Text className="block !text-xs !font-semibold uppercase !text-slate-400">
                      Giới tính
                    </Typography.Text>
                    <Typography.Text className="!font-semibold !text-ink">
                      {getGenderText(user.gender)}
                    </Typography.Text>
                  </div>
                </div>
              </Space>
            </Card>
          </Col>

          <Col xs={24} lg={16}>
            <Card className="h-full profile-tabs-card">
              <Tabs
                destroyOnHidden
                items={[
                  {
                    key: 'profile',
                    label: 'Thông tin',
                    children: (
                      <Form<UpdateUserProfilePayload>
                form={form}
                layout="vertical"
                requiredMark={false}
                onFinish={handleSubmit}
              >
                <Row gutter={[16, 0]}>
                  <Col xs={24} md={12}>
                    <Form.Item
                      name="lastName"
                      label="Họ"
                      rules={[
                        { required: true, message: 'Vui lòng nhập họ.' },
                        { min: 3, message: 'Họ tối thiểu 3 ký tự.' },
                        { max: 6, message: 'Họ tối đa 6 ký tự.' },
                      ]}
                    >
                      <Input prefix={<IdcardOutlined />} placeholder="Nguyễn" maxLength={6} />
                    </Form.Item>
                  </Col>

                  <Col xs={24} md={12}>
                    <Form.Item
                      name="firstName"
                      label="Tên"
                      rules={[
                        { required: true, message: 'Vui lòng nhập tên.' },
                        { min: 3, message: 'Tên tối thiểu 3 ký tự.' },
                        { max: 6, message: 'Tên tối đa 6 ký tự.' },
                      ]}
                    >
                      <Input prefix={<UserOutlined />} placeholder="Minh" maxLength={6} />
                    </Form.Item>
                  </Col>

                  <Col xs={24} md={12}>
                    <Form.Item
                      name="phoneNumber"
                      label="Số điện thoại"
                      rules={[
                        { required: true, message: 'Vui lòng nhập số điện thoại.' },
                        {
                          pattern: PHONE_NUMBER_PATTERN,
                          message: 'Số điện thoại phải có 10 số và bắt đầu bằng 03, 05, 07, 08 hoặc 09.',
                        },
                      ]}
                    >
                      <Input prefix={<PhoneOutlined />} placeholder="0901234567" maxLength={10} />
                    </Form.Item>
                  </Col>

                  <Col xs={24} md={12}>
                    <Form.Item
                      name="gender"
                      label="Giới tính"
                      rules={[{ required: true, message: 'Vui lòng chọn giới tính.' }]}
                    >
                      <Radio.Group
                        optionType="button"
                        buttonStyle="solid"
                        className="w-full"
                        options={[
                          { label: 'Nam', value: true },
                          { label: 'Nữ', value: false },
                        ]}
                      />
                    </Form.Item>
                  </Col>
                </Row>

                <div className="mt-2 rounded-lg border border-slate-200 bg-slate-50 p-4">
                  <Space align="start">
                    <SafetyCertificateOutlined className="mt-1 text-sage" />
                    <div>
                      <Typography.Text className="block !font-semibold !text-ink">
                        Email và vai trò được quản lý bởi hệ thống
                      </Typography.Text>
                      <Typography.Text className="!text-sm !text-slate-500">
                        Nếu cần thay đổi email hoặc quyền truy cập, vui lòng liên hệ quản trị viên.
                      </Typography.Text>
                    </div>
                  </Space>
                </div>

                <div className="mt-6 flex flex-col gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:items-center sm:justify-between">
                  <Space size={10}>
                    <CheckCircleOutlined className="text-sage" />
                    <Typography.Text className="!text-sm !text-slate-500">
                      Thông tin được dùng cho lịch hẹn và chăm sóc khách hàng.
                    </Typography.Text>
                  </Space>
                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={submitting}
                    disabled={!hasProfileChanges || submitting}
                  >
                    Lưu thay đổi
                  </Button>
                </div>
                      </Form>
                    ),
                  },
                  {
                    key: 'security',
                    label: 'Bảo mật',
                    children: (
                      <Form<ChangePasswordFormValues>
                form={passwordForm}
                layout="vertical"
                requiredMark={false}
                onFinish={handleChangePassword}
              >
                <Row gutter={[16, 0]}>
                  <Col xs={24} md={12}>
                    <Form.Item
                      name="currentPassword"
                      label="Mật khẩu hiện tại"
                      rules={[{ required: true, message: 'Vui lòng nhập mật khẩu hiện tại.' }]}
                    >
                      <Input.Password prefix={<LockOutlined />} placeholder="Mật khẩu hiện tại" />
                    </Form.Item>
                  </Col>

                  <Col xs={24} md={12}>
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
                  </Col>

                  <Col xs={24} md={12}>
                    <Form.Item
                      name="rePassword"
                      label="Nhập lại mật khẩu mới"
                      dependencies={['newPassword']}
                      rules={[
                        { required: true, message: 'Vui lòng nhập lại mật khẩu mới.' },
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
                      <Input.Password prefix={<LockOutlined />} placeholder="Nhập lại mật khẩu mới" maxLength={10} />
                    </Form.Item>
                  </Col>
                </Row>

                <div className="flex justify-end border-t border-slate-100 pt-5">
                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={passwordSubmitting}
                    disabled={!canSubmitPassword || passwordSubmitting}
                  >
                    Cập nhật mật khẩu
                  </Button>
                </div>
                      </Form>
                    ),
                  },
                ]}
              />
            </Card>
          </Col>
        </Row>
      </div>
    </main>
  );
}
