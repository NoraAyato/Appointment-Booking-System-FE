import {
  HomeOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from '@ant-design/icons';
import { Avatar, Button, Layout, Menu, Space, Typography } from 'antd';
import type { MenuProps } from 'antd';
import { useEffect, useMemo, useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';

import { useAppDispatch, useAppSelector } from '@/app/redux/hooks';
import { logout } from '@/features/auth/store/auth-thunk';
import { APP_BRAND } from '@/shared/constants/brand';
import { getAvatarInitial } from '@/shared/utils/avatar';

import type { DashboardNavItem } from '../types/dashboard-type';

const { Sider, Content } = Layout;

interface ActiveNavMatch {
  parentKey?: string;
  selectedKey?: string;
}

interface NavMatchCandidate {
  item: DashboardNavItem;
  parentKey?: string;
  path: string;
}

interface DashboardLayoutProps {
  navItems: DashboardNavItem[];
  title: string;
  subtitle: string;
}

export function DashboardLayout({ navItems, title, subtitle }: DashboardLayoutProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [openKeys, setOpenKeys] = useState<string[]>([]);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);

  const menuItems = useMemo<MenuProps['items']>(
    () =>
      navItems.map((item) => ({
        key: item.key,
        icon: item.icon,
        label: item.path ? <Link to={item.path}>{item.label}</Link> : item.label,
        children: item.children?.map((child) => ({
          key: child.key,
          icon: child.icon,
          label: child.path ? <Link to={child.path}>{child.label}</Link> : child.label,
        })),
      })),
    [navItems],
  );

  const activeNavMatch = useMemo<ActiveNavMatch>(() => {
    const matchedItems: NavMatchCandidate[] = navItems.flatMap((item) => {
      if (!item.children?.length) {
        return item.path ? [{ item, path: item.path }] : [];
      }

      return item.children
        .filter((child) => child.path)
        .map((child) => ({
          item: child,
          parentKey: item.key,
          path: child.path as string,
        }));
    });

    const activeItem = matchedItems
      .sort((a, b) => b.path.length - a.path.length)
      .find(({ path }) => location.pathname === path || location.pathname.startsWith(`${path}/`));

    return {
      parentKey: activeItem?.parentKey,
      selectedKey: activeItem?.item.key ?? navItems[0]?.key,
    };
  }, [location.pathname, navItems]);

  useEffect(() => {
    if (!activeNavMatch.parentKey) {
      return;
    }

    setOpenKeys((currentOpenKeys) =>
      currentOpenKeys.includes(activeNavMatch.parentKey!)
        ? currentOpenKeys
        : [...currentOpenKeys, activeNavMatch.parentKey!],
    );
  }, [activeNavMatch.parentKey]);

  const handleLogout = async () => {
    await dispatch(logout());
    navigate('/');
  };

  return (
    <Layout className="min-h-screen bg-[#f7f4ee]">
      <Sider
        width={280}
        collapsedWidth={84}
        collapsible
        collapsed={collapsed}
        trigger={null}
        className="dashboard-sider"
      >
        <div className="flex h-full flex-col">
          <Link
            to="/"
            className="flex min-h-[76px] items-center gap-3 border-b border-white/10 px-4 text-white"
          >
            <div className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-white text-lg font-bold text-[#214f45]">
              {APP_BRAND.initial}
            </div>
            {!collapsed ? (
              <div className="min-w-0 leading-tight">
                <Typography.Text className="block truncate !text-base !font-bold !text-white">
                  {APP_BRAND.name}
                </Typography.Text>
                <Typography.Text className="block truncate !text-xs !text-white/60">
                  Dashboard
                </Typography.Text>
              </div>
            ) : null}
          </Link>

          <div className="m-4 flex items-center gap-3 rounded-lg border border-white/10 bg-white/[0.08] px-3 py-3">
            <Avatar src={user?.avatarUrl || undefined} size={collapsed ? 36 : 42}>
              {getAvatarInitial(user?.fullName, user?.email)}
            </Avatar>
            {!collapsed ? (
              <div className="min-w-0">
                <Typography.Text className="block truncate !font-semibold !text-white">
                  {user?.fullName ?? title}
                </Typography.Text>
                <Typography.Text className="block truncate !text-xs !text-white/60">
                  {subtitle}
                </Typography.Text>
              </div>
            ) : null}
          </div>

          <Menu
            className="dashboard-menu flex-1 border-none !bg-transparent !px-3 !py-2"
            mode="inline"
            theme="dark"
            selectedKeys={activeNavMatch.selectedKey ? [activeNavMatch.selectedKey] : []}
            openKeys={collapsed ? [] : openKeys}
            onOpenChange={setOpenKeys}
            items={menuItems}
          />

          <div className="border-t border-white/10 p-3">
            <Space direction="vertical" size={8} className="w-full">
              <Button
                block
                className="dashboard-sidebar-action"
                icon={<HomeOutlined />}
                onClick={() => navigate('/')}
                type="text"
              >
                {!collapsed ? 'Về trang chủ' : null}
              </Button>
              <Button
                block
                danger
                className="dashboard-sidebar-action dashboard-sidebar-action-danger"
                icon={<LogoutOutlined />}
                onClick={() => void handleLogout()}
                type="text"
              >
                {!collapsed ? 'Đăng xuất' : null}
              </Button>
            </Space>
          </div>
        </div>
      </Sider>

      <Layout className="bg-transparent">
        <div className="flex min-h-[76px] items-center justify-between border-b border-slate-200/80 bg-white/[0.92] px-4 shadow-[0_10px_30px_rgba(25,39,68,0.04)] backdrop-blur md:px-8">
          <div>
            <Typography.Title level={4} className="!mb-0 !text-ink">
              {title}
            </Typography.Title>
            <Typography.Text className="!text-sm !text-slate-500">{subtitle}</Typography.Text>
          </div>
          <Button
            className="border-slate-200"
            type="default"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed((value) => !value)}
          />
        </div>

        <Content className="px-4 py-6 md:px-8">
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}
