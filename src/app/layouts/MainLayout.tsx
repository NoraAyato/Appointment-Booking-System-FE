import {
  DownOutlined,
  GiftOutlined,
  HistoryOutlined,
  HomeOutlined,
  LogoutOutlined,
  SettingOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Avatar, Button, Dropdown, Layout, Menu, Space, Tag, Typography } from 'antd';
import type { MenuProps } from 'antd';
import { useMemo, useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';

import { useAppDispatch, useAppSelector } from '@/app/redux/hooks';
import { LoginModal } from '@/features/auth/components/LoginModal';
import { logout } from '@/features/auth/store/auth-slice';

const { Header, Content, Footer } = Layout;

const navItems = [
  { key: '/', label: 'Trang chủ', icon: <HomeOutlined /> },
  { key: '/promotions', label: 'Khuyến mãi', icon: <GiftOutlined /> },
  { key: '/booking-history', label: 'Lịch sử', icon: <HistoryOutlined /> },
];

export function MainLayout() {
  const [loginOpen, setLoginOpen] = useState(false);
  const user = useAppSelector((state) => state.auth.user);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const selectedKey = useMemo(() => {
    const match = navItems.find((item) => item.key === location.pathname);
    return match?.key ?? '';
  }, [location.pathname]);

  const handleLogout = async () => {
    await dispatch(logout());
    navigate('/');
  };

  const dashboardPath =
    user?.role === 'admin' ? '/admin/dashboard' : user?.role === 'staff' ? '/staff/dashboard' : '';

  const userMenuItems: MenuProps['items'] = [
    ...(dashboardPath
      ? [
          {
            key: 'dashboard',
            icon: <SettingOutlined />,
            label: <Link to={dashboardPath}>Dashboard</Link>,
          },
        ]
      : []),
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: <Link to="/profile">Profile user</Link>,
    },
    {
      key: 'history',
      icon: <HistoryOutlined />,
      label: <Link to="/booking-history">Lịch sử đặt dịch vụ</Link>,
    },
    {
      key: 'promotions',
      icon: <GiftOutlined />,
      label: <Link to="/promotions">Khuyến mãi</Link>,
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Đăng xuất',
      danger: true,
      onClick: handleLogout,
    },
  ];

  return (
    <Layout className="min-h-screen bg-[#f6f4ee]">
      <Header className="sticky top-0 z-30 h-auto border-b border-slate-200/80 bg-white/90 px-4 py-0 backdrop-blur md:px-8">
        <div className="mx-auto flex min-h-[72px] max-w-7xl items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-3 text-ink">
            <div className="grid h-10 w-10 place-items-center rounded-lg bg-[#2f7d67] text-lg font-bold text-white">
              Y
            </div>
            <div className="leading-tight">
              <Typography.Text className="block !text-base !font-bold !text-ink">YoEdu</Typography.Text>
              <Typography.Text className="block !text-xs !text-slate-500">
                Appointment Booking
              </Typography.Text>
            </div>
          </Link>

          <Menu
            className="hidden min-w-0 flex-1 justify-center border-none bg-transparent lg:flex"
            mode="horizontal"
            selectedKeys={[selectedKey]}
            items={navItems.map((item) => ({
              key: item.key,
              icon: item.icon,
              label: <Link to={item.key}>{item.label}</Link>,
            }))}
          />

          {user ? (
            <Dropdown menu={{ items: userMenuItems }} trigger={['click']} placement="bottomRight">
              <Button className="h-11 px-2" type="text">
                <Space size={10}>
                  <Avatar src={user.avatarUrl} size={34} />
                  <span className="hidden max-w-[128px] truncate font-semibold text-ink sm:inline">
                    {user.fullName}
                  </span>
                  <Tag className="hidden capitalize sm:inline" color={user.role === 'admin' ? 'gold' : 'green'}>
                    {user.role}
                  </Tag>
                  <DownOutlined className="text-xs text-slate-500" />
                </Space>
              </Button>
            </Dropdown>
          ) : (
            <Button type="primary" icon={<UserOutlined />} onClick={() => setLoginOpen(true)}>
              Đăng nhập
            </Button>
          )}
        </div>
      </Header>

      <Content>
        <Outlet context={{ openLogin: () => setLoginOpen(true) }} />
      </Content>

      <Footer className="border-t border-slate-200 bg-white px-4">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 text-sm text-slate-500 md:flex-row md:items-center md:justify-between">
          <span>YoEdu Appointment Booking</span>
          <span>Mock frontend, sẵn sàng nối API HttpOnly cookie khi backend có contract.</span>
        </div>
      </Footer>

      <LoginModal open={loginOpen} onClose={() => setLoginOpen(false)} />
    </Layout>
  );
}
