import type { UserRole } from '../types/user-type';

export const getDashboardPathByRole = (role?: UserRole) => {
  if (role === 'ADMIN') {
    return '/admin/dashboard';
  }

  if (role === 'STAFF') {
    return '/staff/dashboard';
  }

  return '';
};
