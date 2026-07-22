import { createBrowserRouter } from 'react-router-dom';

import { AppRootLayout } from '@/app/layouts/AppRootLayout';
import { MainLayout } from '@/app/layouts/MainLayout';
import { AboutPage } from '@/features/about/pages/AboutPage';
import { GoogleCallbackPage } from '@/features/auth/pages/GoogleCallbackPage';
import { ResetPasswordPage } from '@/features/auth/pages/ResetPasswordPage';
import { AppointmentConfirmPage } from '@/features/appointments/pages/AppointmentConfirmPage';
import { AppointmentHistoryPage } from '@/features/appointments/pages/AppointmentHistoryPage';
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
import { AdminDashboardPage } from '@/features/admin-dashboard/pages/AdminDashboardPage';
import { StaffAppointmentsPage } from '@/features/staff-appointments/pages/StaffAppointmentsPage';
import { StaffDashboardPage } from '@/features/staff-dashboard/pages/StaffDashboardPage';
import { StaffLeaveRequestsPage } from '@/features/staff-leave-requests/pages/StaffLeaveRequestsPage';
import { StaffShiftsPage } from '@/features/staff-shifts/pages/StaffShiftsPage';
import { HomePage } from '@/features/home/pages/HomePage';
import { InvoiceCheckoutPage } from '@/features/invoices/pages/InvoiceCheckoutPage';
import { PaymentResultPage } from '@/features/payments/pages/PaymentResultPage';
import { PromotionsPage } from '@/features/promotions/pages/PromotionsPage';
import { ServiceDetailPage } from '@/features/public-services/pages/ServiceDetailPage';
import { ServicesPage } from '@/features/public-services/pages/ServicesPage';
import { ProfilePage } from '@/features/users/pages/ProfilePage';
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
            path: 'services',
            element: <ServicesPage />,
          },
          {
            path: 'services/:serviceId',
            element: <ServiceDetailPage />,
          },
          {
            path: 'about',
            element: <AboutPage />,
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
          {
            path: 'appointments/confirm',
            element: (
              <ProtectedRoute>
                <AppointmentConfirmPage />
              </ProtectedRoute>
            ),
          },
          {
            path: 'invoices/checkout',
            element: (
              <ProtectedRoute>
                <InvoiceCheckoutPage />
              </ProtectedRoute>
            ),
          },
          {
            path: 'payment/result',
            element: (
              <ProtectedRoute>
                <PaymentResultPage />
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
              subtitle="Không gian làm việc nhân viên"
            />
          </ProtectedRoute>
        ),
        children: [
          {
            index: true,
            element: <StaffDashboardPage />,
          },
          {
            path: 'appointments',
            element: <StaffAppointmentsPage />,
          },
          {
            path: 'work-shifts',
            element: <StaffShiftsPage />,
          },
          {
            path: 'leave-requests',
            element: <StaffLeaveRequestsPage />,
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
              subtitle="Điều phối vận hành đặt lịch"
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
