import { GiftOutlined, HistoryOutlined, HomeOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Layout, Menu, Typography } from 'antd';
import { useMemo, useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';

import { useAppDispatch, useAppSelector } from '@/app/redux/hooks';
import { AuthModal } from '@/features/auth/components/AuthModal';
import { logout } from '@/features/auth/store/auth-thunk';
import { UserDropdown } from '@/features/users/components/UserDropdown';
import { APP_BRAND } from '@/shared/constants/brand';

const { Header, Content, Footer } = Layout;

const navItems = [
  { key: '/', label: 'Trang chủ', icon: <HomeOutlined /> },
  { key: '/promotions', label: 'Khuyến mãi', icon: <GiftOutlined /> },
  { key: '/booking-history', label: 'Lịch sử', icon: <HistoryOutlined /> },
];

export function MainLayout() {
  const [authOpen, setAuthOpen] = useState(false);
  const user = useAppSelector((state) => state.users.currentUser);
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

  return (
    <Layout className="min-h-screen bg-[#f7f4ee]">
      <Header className="sticky top-0 z-30 h-auto border-b border-slate-200/80 bg-white/[0.92] px-4 py-0 shadow-[0_10px_30px_rgba(25,39,68,0.04)] backdrop-blur md:px-8">
        <div className="mx-auto flex min-h-[72px] max-w-7xl items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-3 text-ink">
            <div className="grid h-10 w-10 place-items-center rounded-lg bg-[#214f45] text-lg font-bold text-white shadow-sm">
              {APP_BRAND.initial}
            </div>
            <div className="leading-tight">
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
              label: <Link to={item.key}>{item.label}</Link>,
            }))}
          />

          {user ? (
            <UserDropdown user={user} onLogout={handleLogout} />
          ) : (
            <Button type="primary" icon={<UserOutlined />} onClick={() => setAuthOpen(true)}>
              Đăng nhập
            </Button>
          )}
        </div>
      </Header>

      <Content>
        <Outlet context={{ openLogin: () => setAuthOpen(true) }} />
      </Content>

      <Footer className="border-t border-slate-200 bg-white px-4">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 text-sm text-slate-500 md:flex-row md:items-center md:justify-between">
          <span>{APP_BRAND.name} appointment booking</span>
          <span>Đặt lịch chăm sóc tại nhà gọn gàng, riêng tư và dễ theo dõi.</span>
        </div>
      </Footer>

      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} />
    </Layout>
  );
}
