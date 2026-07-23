import type { AdminUserRole, AdminUserStatusFilter } from '../types/admin-user-type';

export const ADMIN_USER_ROLE_OPTIONS: Array<{ label: string; value: AdminUserRole }> = [
  { label: 'Quản trị viên', value: 'ADMIN' },
  { label: 'Nhân viên', value: 'STAFF' },
  { label: 'Khách hàng', value: 'CUSTOMER' },
];

export const ADMIN_USER_STATUS_OPTIONS: Array<{ label: string; value: AdminUserStatusFilter }> = [
  { label: 'Đang hoạt động', value: 'ACTIVE' },
  { label: 'Ngừng hoạt động', value: 'INACTIVE' },
];

export const getAdminUserRoleLabel = (role: string) =>
  ADMIN_USER_ROLE_OPTIONS.find((option) => option.value === role)?.label ?? role;

export const getAdminUserStatusMeta = (status: string) => {
  const normalizedStatus = status.toUpperCase();

  if (normalizedStatus === 'ACTIVE') {
    return { color: 'green', label: 'Đang hoạt động' };
  }

  if (normalizedStatus === 'BLOCKED' || normalizedStatus === 'INACTIVE') {
    return { color: 'red', label: 'Ngừng hoạt động' };
  }

  return { color: 'default', label: status || 'Chưa cập nhật' };
};

export const normalizeAdminUserStatus = (status: string): AdminUserStatusFilter => {
  const normalizedStatus = status.toUpperCase();

  if (normalizedStatus === 'BLOCKED' || normalizedStatus === 'INACTIVE') {
    return 'INACTIVE';
  }

  return 'ACTIVE';
};
