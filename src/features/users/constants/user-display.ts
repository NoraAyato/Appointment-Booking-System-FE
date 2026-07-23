import type { UserRole } from '../types/user-type';

interface UserDisplayMeta {
  color: string;
  label: string;
}

const USER_ROLE_META: Record<UserRole, UserDisplayMeta> = {
  ADMIN: {
    color: 'gold',
    label: 'Quản trị viên',
  },
  CUSTOMER: {
    color: 'green',
    label: 'Khách hàng',
  },
  STAFF: {
    color: 'blue',
    label: 'Nhân viên',
  },
};

const USER_STATUS_META: Record<string, UserDisplayMeta> = {
  ACTIVE: {
    color: 'success',
    label: 'Hoạt động',
  },
  BLOCKED: {
    color: 'error',
    label: 'Bị khóa',
  },
  DELETED: {
    color: 'default',
    label: 'Đã xóa',
  },
  INACTIVE: {
    color: 'default',
    label: 'Không hoạt động',
  },
  PENDING: {
    color: 'processing',
    label: 'Chờ duyệt',
  },
};

export const getUserRoleMeta = (role: UserRole): UserDisplayMeta => USER_ROLE_META[role];

export const getUserStatusMeta = (status?: string | null): UserDisplayMeta | null => {
  if (!status) {
    return null;
  }

  return (
    USER_STATUS_META[status] ?? {
      color: 'default',
      label: 'Chưa xác định',
    }
  );
};
