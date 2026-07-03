import { GiftOutlined, HistoryOutlined, LogoutOutlined, SettingOutlined, UserOutlined } from '@ant-design/icons';
import { Avatar, Button, Dropdown, Space } from 'antd';
import type { MenuProps } from 'antd';
import { Link } from 'react-router-dom';

import { getAvatarInitial } from '@/shared/utils/avatar';

import type { User } from '../types/user-type';
import { getDashboardPathByRole } from '../utils/role-route';

interface UserDropdownProps {
  user: User;
  onLogout: () => void;
}

export function UserDropdown({ user, onLogout }: UserDropdownProps) {
  const dashboardPath = getDashboardPathByRole(user.role);

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
      onClick: onLogout,
    },
  ];

  return (
    <Dropdown menu={{ items: userMenuItems }} trigger={['hover']} placement="bottomLeft">
      <Button className="h-11 px-2" type="text">
        <Space size={10}>
          <Avatar src={user.avatarUrl || undefined} size={34}>
            {getAvatarInitial(user.fullName, user.email)}
          </Avatar>
          <span className="hidden max-w-[128px] truncate font-semibold text-ink sm:inline">
            {user.fullName}
          </span>
        </Space>
      </Button>
    </Dropdown>
  );
}
