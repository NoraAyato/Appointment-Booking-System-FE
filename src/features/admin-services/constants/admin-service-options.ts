import type { AdminServiceStatus } from '../types/admin-service-type';

export const ADMIN_SERVICE_STATUS_OPTIONS: Array<{ label: string; value: AdminServiceStatus }> = [
  { label: 'Đang hoạt động', value: 'ACTIVE' },
  { label: 'Ngừng hoạt động', value: 'INACTIVE' },
];

export const getAdminServiceStatusMeta = (status: string) => {
  const normalizedStatus = status.toUpperCase();

  if (normalizedStatus === 'ACTIVE') {
    return { color: 'green', label: 'Đang hoạt động' };
  }

  if (normalizedStatus === 'INACTIVE' || normalizedStatus === 'BLOCKED') {
    return { color: 'red', label: 'Ngừng hoạt động' };
  }

  return { color: 'default', label: status || 'Chưa cập nhật' };
};
