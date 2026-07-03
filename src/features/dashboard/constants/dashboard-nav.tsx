import {
  AppstoreOutlined,
  BarChartOutlined,
  CalendarOutlined,
  GiftOutlined,
  LockOutlined,
  MessageOutlined,
  ReadOutlined,
  TeamOutlined,
} from '@ant-design/icons';

import type { DashboardNavItem } from '../types/dashboard-type';

export const adminDashboardNavItems: DashboardNavItem[] = [
  {
    key: 'statistics',
    label: 'Thống kê',
    path: '/admin/dashboard',
    icon: <BarChartOutlined />,
  },
  {
    key: 'users',
    label: 'Quản lý người dùng',
    path: '/admin/dashboard/users',
    icon: <TeamOutlined />,
  },
  {
    key: 'promotions',
    label: 'Quản lý khuyến mãi',
    path: '/admin/dashboard/promotions',
    icon: <GiftOutlined />,
  },
  {
    key: 'reviews',
    label: 'Quản lý đánh giá',
    path: '/admin/dashboard/reviews',
    icon: <MessageOutlined />,
  },
  {
    key: 'service-management',
    label: 'Quản lý dịch vụ',
    icon: <AppstoreOutlined />,
    children: [
      {
        key: 'categories',
        label: 'Danh mục',
        path: '/admin/dashboard/categories',
        icon: <ReadOutlined />,
      },
      {
        key: 'services',
        label: 'Dịch vụ',
        path: '/admin/dashboard/services',
        icon: <AppstoreOutlined />,
      },
    ],
  },
  {
    key: 'slot-locks',
    label: 'Quản lý khóa slot',
    path: '/admin/dashboard/slot-locks',
    icon: <LockOutlined />,
  },
];

export const staffDashboardNavItems: DashboardNavItem[] = [
  {
    key: 'schedule',
    label: 'Lịch làm việc',
    path: '/staff/dashboard',
    icon: <CalendarOutlined />,
  },
];
