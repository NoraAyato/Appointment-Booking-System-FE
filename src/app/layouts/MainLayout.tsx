import {
  CalendarOutlined,
  CustomerServiceOutlined,
  GiftOutlined,
  HomeOutlined,
  InfoCircleOutlined,
  MailOutlined,
  PhoneOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Button, Layout, Menu, Space, Typography } from 'antd';
import { useMemo, useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';

import { useAppDispatch, useAppSelector } from '@/app/redux/hooks';
import { AuthModal } from '@/features/auth/components/AuthModal';
import { logout } from '@/features/auth/store/auth-thunk';
import { UserDropdown } from '@/features/users/components/UserDropdown';
import { APP_BRAND } from '@/shared/constants/brand';

const { Header, Content, Footer } = Layout;

const navItems = [
  { key: '/', label: 'Trang chủ', icon: <HomeOutlined />, to: '/' },
  { key: '/services', label: 'Dịch vụ', icon: <CustomerServiceOutlined />, to: '/services' },
  { key: '/promotions', label: 'Khuyến mãi', icon: <GiftOutlined />, to: '/promotions' },
  { key: '/about', label: 'Về chúng tôi', icon: <InfoCircleOutlined />, to: '/about' },
];

export function MainLayout() {
  const [authOpen, setAuthOpen] = useState(false);
  const user = useAppSelector((state) => state.users.currentUser);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const selectedKey = useMemo(() => {
    if (location.pathname === '/services') {
      return '/services';
    }

    if (location.pathname === '/promotions') {
      return '/promotions';
    }

    if (location.pathname === '/about') {
      return '/about';
    }

    return location.pathname === '/' ? '/' : '';
  }, [location.pathname]);

  const handleLogout = async () => {
    await dispatch(logout());
    navigate('/');
  };

  return (
    <Layout className="min-h-screen bg-[#f7f4ee]">
      <Header className="sticky top-0 z-30 h-auto border-b border-slate-200/80 bg-white/[0.94] px-4 py-0 shadow-[0_10px_30px_rgba(25,39,68,0.04)] backdrop-blur md:px-8">
        <div className="mx-auto flex min-h-[76px] max-w-7xl items-center justify-between gap-4">
          <Link to="/" className="flex min-w-0 items-center gap-3 text-ink">
            <div className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-[#214f45] text-lg font-bold text-white shadow-sm">
              {APP_BRAND.initial}
            </div>
            <div className="hidden leading-tight sm:block">
              <Typography.Text className="block !text-base !font-bold !text-ink">
                {APP_BRAND.name}
              </Typography.Text>
              <Typography.Text className="block !text-xs !text-slate-500">
                {APP_BRAND.tagline}
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
              label: <Link to={item.to}>{item.label}</Link>,
            }))}
          />

          <Space size={10} className="shrink-0">
            {user ? (
              <UserDropdown user={user} onLogout={handleLogout} />
            ) : (
              <Button type="primary" icon={<UserOutlined />} onClick={() => setAuthOpen(true)}>
                Đăng nhập
              </Button>
            )}
          </Space>
        </div>

        <Menu
          className="border-none bg-transparent pb-2 lg:hidden"
          mode="horizontal"
          selectedKeys={[selectedKey]}
          items={navItems.map((item) => ({
            key: item.key,
            label: <Link to={item.to}>{item.label}</Link>,
          }))}
        />
      </Header>

      <Content>
        <Outlet context={{ openLogin: () => setAuthOpen(true) }} />
      </Content>

      <Footer className="border-t border-slate-200 bg-[#17223b] px-4 py-10 text-white md:px-8">
        <div className="mx-auto grid max-w-7xl gap-8 md:grid-cols-[1.2fr_0.8fr_0.8fr]">
          <div>
            <Link to="/" className="mb-4 flex items-center gap-3">
              <div className="grid h-11 w-11 place-items-center rounded-lg bg-white text-lg font-bold text-[#214f45]">
                {APP_BRAND.initial}
              </div>
              <div>
                <Typography.Text className="block !text-base !font-bold !text-white">
                  {APP_BRAND.name}
                </Typography.Text>
                <Typography.Text className="block !text-xs !text-white/60">
                  {APP_BRAND.tagline}
                </Typography.Text>
              </div>
            </Link>
            <Typography.Paragraph className="max-w-md !text-white/70">
              Nền tảng đặt lịch cho trung tâm dịch vụ HomeFeel với trải nghiệm rõ dịch vụ, rõ thời
              gian và dễ theo dõi sau mỗi lịch hẹn.
            </Typography.Paragraph>
          </div>

          <div>
            <Typography.Text className="mb-3 block !font-semibold !text-white">
              Điều hướng
            </Typography.Text>
            <Space direction="vertical" size={8} className="!text-white/70">
              <Link to="/">Trang chủ</Link>
              <Link to="/services">Dịch vụ</Link>
              <Link to="/promotions">Khuyến mãi</Link>
              <Link to="/about">Về chúng tôi</Link>
              <Link to="/booking-history">Lịch sử đặt dịch vụ</Link>
            </Space>
          </div>

          <div>
            <Typography.Text className="mb-3 block !font-semibold !text-white">
              Liên hệ
            </Typography.Text>
            <Space direction="vertical" size={10} className="!text-white/70">
              <Space>
                <PhoneOutlined />
                <span>0900 123 456</span>
              </Space>
              <Space>
                <MailOutlined />
                <span>care@homefeel.local</span>
              </Space>
              <Space>
                <CalendarOutlined />
                <span>Hỗ trợ đặt lịch 24/7</span>
              </Space>
            </Space>
          </div>
        </div>

        <div className="mx-auto mt-8 flex max-w-7xl flex-col gap-2 border-t border-white/10 pt-5 text-sm text-white/50 md:flex-row md:items-center md:justify-between">
          <span>{APP_BRAND.name}</span>
        </div>
      </Footer>

      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} />
    </Layout>
  );
}
