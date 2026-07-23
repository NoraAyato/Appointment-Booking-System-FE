import type { AdminStaffServiceStatus } from '../types/admin-staff-service-type';

export const ADMIN_STAFF_SERVICE_STATUS_OPTIONS: Array<{
  label: string;
  value: AdminStaffServiceStatus;
}> = [
  { label: 'Hoạt động', value: 'ACTIVE' },
  { label: 'Vô hiệu hóa', value: 'BLOCKED' },
];

export const getAdminStaffServiceStatusMeta = (status?: string) => {
  const normalizedStatus = status?.toUpperCase();

  if (normalizedStatus === 'ACTIVE') {
    return {
      color: 'green',
      label: 'Hoạt động',
    };
  }

  if (normalizedStatus === 'BLOCKED') {
    return {
      color: 'red',
      label: 'Vô hiệu hóa',
    };
  }

  return {
    color: 'default',
    label: status || 'Chưa cập nhật',
  };
};
