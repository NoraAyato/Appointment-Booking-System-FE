import { createBrowserRouter } from 'react-router-dom';

import { AppRootLayout } from '@/app/layouts/AppRootLayout';
import { MainLayout } from '@/app/layouts/MainLayout';
import { GoogleCallbackPage } from '@/features/auth/pages/GoogleCallbackPage';
import { ResetPasswordPage } from '@/features/auth/pages/ResetPasswordPage';
import { AppointmentHistoryPage } from '@/features/appointments/pages/AppointmentHistoryPage';
import { HomePage } from '@/features/appointments/pages/HomePage';
import { AdminBlockedSlotsPage } from '@/features/admin-blocked-slots/pages/AdminBlockedSlotsPage';
import { AdminCategoriesPage } from '@/features/admin-categories/pages/AdminCategoriesPage';
import { AdminPromotionsPage } from '@/features/admin-promotions/pages/AdminPromotionsPage';
import { AdminReviewsPage } from '@/features/admin-reviews/pages/AdminReviewsPage';
import { AdminServicesPage } from '@/features/admin-services/pages/AdminServicesPage';
import { AdminStaffServicesPage } from '@/features/admin-staff-services/pages/AdminStaffServicesPage';
import { AdminStaffShiftsPage } from '@/features/admin-staff-shifts/pages/AdminStaffShiftsPage';
import { AdminUsersPage } from '@/features/admin-users/pages/AdminUsersPage';
import { DashboardLayout } from '@/features/dashboard/components/DashboardLayout';
import {
  adminDashboardNavItems,
  staffDashboardNavItems,
} from '@/features/dashboard/constants/dashboard-nav';
import { AdminDashboardPage } from '@/features/dashboard/pages/AdminDashboardPage';
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
        path: 'auth/reset-password',
        element: <ResetPasswordPage />,
      },
      {
        path: 'auth/google-callback',
        element: <GoogleCallbackPage />,
      },
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
            element: <AdminPromotionsPage />,
          },
          {
            path: 'reviews',
            element: <AdminReviewsPage />,
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
            path: 'schedule-locks',
            element: <AdminBlockedSlotsPage />,
          },
          {
            path: 'work-shifts',
            element: <AdminStaffShiftsPage />,
          },
          {
            path: 'staff-assignments',
            element: <AdminStaffServicesPage />,
          },
          {
            path: 'slot-locks',
            element: <AdminBlockedSlotsPage />,
          },
        ],
      },
    ],
  },
]);
