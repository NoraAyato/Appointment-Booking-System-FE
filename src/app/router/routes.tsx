import { createBrowserRouter } from 'react-router-dom';

import { AppInit } from '@/app/init/AppInit';
import { MainLayout } from '@/app/layouts/MainLayout';
import { HomePage } from '@/features/appointments/pages/HomePage';
import { AppointmentHistoryPage } from '@/features/appointments/pages/AppointmentHistoryPage';
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
    element: (
      <AppInit>
        <MainLayout />
      </AppInit>
    ),
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
      {
        path: 'staff/dashboard',
        element: (
          <ProtectedRoute roles={['staff']}>
            <StaffDashboardPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'admin/dashboard',
        element: (
          <ProtectedRoute roles={['admin']}>
            <AdminDashboardPage />
          </ProtectedRoute>
        ),
      },
    ],
  },
]);

