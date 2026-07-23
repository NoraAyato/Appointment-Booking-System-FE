import type { FilterParams } from '@/shared/types/filter-params-type';

export type AdminUserRole = 'ADMIN' | 'STAFF' | 'CUSTOMER';

export type AdminUserStatusFilter = 'ACTIVE' | 'INACTIVE';

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  status: string;
  joinDate: string;
  avatar: string;
}

export interface AdminUserFilterParams extends FilterParams {
  role?: AdminUserRole;
  status?: AdminUserStatusFilter;
}

export interface AdminUserStats {
  totalUsers: number;
  activeUsers: number;
  inactiveUsers: number;
}

export interface AdminStaffOption {
  id: string;
  name: string;
}

export interface UpdateUserInfoPayload {
  role: AdminUserRole;
  status: AdminUserStatusFilter;
}
