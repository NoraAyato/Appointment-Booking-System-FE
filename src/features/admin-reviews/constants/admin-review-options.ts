import type { AdminReviewStatus } from '../types/admin-review-type';

export const ADMIN_REVIEW_STATUS_OPTIONS: Array<{
  label: string;
  value: AdminReviewStatus;
}> = [
  { label: 'Chờ duyệt', value: 'PENDING' },
  { label: 'Đã duyệt', value: 'APPROVED' },
  { label: 'Đã bỏ', value: 'DROPPED' },
];

export const getAdminReviewStatusMeta = (status?: string) => {
  const normalizedStatus = status?.toUpperCase();

  if (normalizedStatus === 'APPROVED') {
    return {
      color: 'green',
      label: 'Đã duyệt',
    };
  }

  if (normalizedStatus === 'DROPPED') {
    return {
      color: 'red',
      label: 'Đã bỏ',
    };
  }

  if (normalizedStatus === 'PENDING' || normalizedStatus === 'ENDING') {
    return {
      color: 'gold',
      label: 'Chờ duyệt',
    };
  }

  return {
    color: 'default',
    label: status || 'Chưa cập nhật',
  };
};
