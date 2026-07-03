import { createBrowserRouter } from 'react-router-dom';

import { AppRootLayout } from '@/app/layouts/AppRootLayout';
import { MainLayout } from '@/app/layouts/MainLayout';
import { AppointmentHistoryPage } from '@/features/appointments/pages/AppointmentHistoryPage';
import { HomePage } from '@/features/appointments/pages/HomePage';
import { AdminCategoriesPage } from '@/features/admin-categories/pages/AdminCategoriesPage';
import { AdminServicesPage } from '@/features/admin-services/pages/AdminServicesPage';
import { AdminUsersPage } from '@/features/admin-users/pages/AdminUsersPage';
import { DashboardLayout } from '@/features/dashboard/components/DashboardLayout';
import {
  adminDashboardNavItems,
  staffDashboardNavItems,
} from '@/features/dashboard/constants/dashboard-nav';
import { AdminDashboardPage } from '@/features/dashboard/pages/AdminDashboardPage';
import { AdminManagementPage } from '@/features/dashboard/pages/AdminManagementPage';
import { StaffDashboardPage } from '@/features/dashboard/pages/StaffDashboardPage';
import { ProfilePage } from '@/features/profile/pages/ProfilePage';
import { PromotionsPage } from '@/features/promotions/pages/PromotionsPage';
import { AppRouteError } from '@/shared/components/AppRouteError';

import { ProtectedRoute } from './ProtectedRoute';

export const router = createBrowserRouter([
  {
    path: '/',
    errorElement: <AppRouteError />,
    element: <AppRootLayout />,
    children: [
      {
        element: <MainLayout />,
        children: [
          {
            index: true,
            element: <HomePage />,
          },
          {
            path: 'promotions',
            element: <PromotionsPage />,
          },
          {
            path: 'profile',
            element: (
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            ),
          },
          {
            path: 'booking-history',
            element: (
              <ProtectedRoute>
                <AppointmentHistoryPage />
              </ProtectedRoute>
            ),
          },
        ],
      },
      {
        path: 'staff/dashboard',
        element: (
          <ProtectedRoute roles={['STAFF']}>
            <DashboardLayout
              navItems={staffDashboardNavItems}
              title="HomeFeel Staff"
              subtitle="Lịch làm việc"
            />
          </ProtectedRoute>
        ),
        children: [
          {
            index: true,
            element: <StaffDashboardPage />,
          },
        ],
      },
      {
        path: 'admin/dashboard',
        element: (
          <ProtectedRoute roles={['ADMIN']}>
            <DashboardLayout
              navItems={adminDashboardNavItems}
              title="HomeFeel Admin"
              subtitle="Quản trị hệ thống đặt lịch"
            />
          </ProtectedRoute>
        ),
        children: [
          {
            index: true,
            element: <AdminDashboardPage />,
          },
          {
            path: 'users',
            element: <AdminUsersPage />,
          },
          {
            path: 'promotions',
            element: (
              <AdminManagementPage
                title="Quản lý khuyến mãi"
                description="Theo dõi mã ưu đãi, thời hạn và trạng thái áp dụng."
                sampleName="Danh sách khuyến mãi mock"
              />
            ),
          },
          {
            path: 'reviews',
            element: (
              <AdminManagementPage
                title="Quản lý đánh giá"
                description="Kiểm duyệt đánh giá dịch vụ và phản hồi từ khách hàng."
                sampleName="Danh sách đánh giá mock"
              />
            ),
          },
          {
            path: 'services',
            element: <AdminServicesPage />,
          },
          {
            path: 'categories',
            element: <AdminCategoriesPage />,
          },
          {
            path: 'slot-locks',
            element: (
              <AdminManagementPage
                title="Quản lý khóa slot"
                description="Quản lý các khoảng thời gian nhân viên không nhận lịch."
                sampleName="Danh sách slot bị khóa mock"
              />
            ),
          },
        ],
      },
    ],
  },
]);
