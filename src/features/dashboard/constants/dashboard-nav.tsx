import {
  AppstoreOutlined,
  ApartmentOutlined,
  BarChartOutlined,
  CalendarOutlined,
  CarryOutOutlined,
  ClockCircleOutlined,
  GiftOutlined,
  LockOutlined,
  MessageOutlined,
  ReadOutlined,
  ScheduleOutlined,
  TeamOutlined,
  UserSwitchOutlined,
} from '@ant-design/icons';

import type { DashboardNavItem } from '../types/dashboard-type';

export const adminDashboardNavItems: DashboardNavItem[] = [
  {
    key: 'statistics',
    label: 'Tổng quan vận hành',
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
    key: 'staff-management',
    label: 'Quản lý nhân viên',
    icon: <UserSwitchOutlined />,
    children: [
      {
        key: 'schedule-locks',
        label: 'Khóa lịch',
        path: '/admin/dashboard/schedule-locks',
        icon: <LockOutlined />,
      },
      {
        key: 'work-shifts',
        label: 'Ca làm việc',
        path: '/admin/dashboard/work-shifts',
        icon: <ScheduleOutlined />,
      },
      {
        key: 'staff-assignments',
        label: 'Phân công',
        path: '/admin/dashboard/staff-assignments',
        icon: <ApartmentOutlined />,
      },
    ],
  },
];

export const staffDashboardNavItems: DashboardNavItem[] = [
  {
    key: 'staff-dashboard',
    label: 'Tổng quan công việc',
    path: '/staff/dashboard',
    icon: <CalendarOutlined />,
  },
  {
    key: 'staff-appointments',
    label: 'Lịch hẹn của tôi',
    path: '/staff/dashboard/appointments',
    icon: <CarryOutOutlined />,
  },
  {
    key: 'my-shifts',
    label: 'Ca làm việc của tôi',
    path: '/staff/dashboard/work-shifts',
    icon: <ClockCircleOutlined />,
  },
  {
    key: 'leave-requests',
    label: 'Xin nghỉ',
    path: '/staff/dashboard/leave-requests',
    icon: <LockOutlined />,
  },
];
