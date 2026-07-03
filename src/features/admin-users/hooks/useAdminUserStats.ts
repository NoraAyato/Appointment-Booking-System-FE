import { useCallback, useEffect, useState } from 'react';

import { getApiErrorMessage } from '@/shared/utils/api-error';

import { adminUserRoleAdminApi } from '../api/admin-user-api';
import type { AdminUserStats } from '../types/admin-user-type';

const emptyStats: AdminUserStats = {
  activeUsers: 0,
  inactiveUsers: 0,
  totalUsers: 0,
};

export function useAdminUserStats() {
  const [stats, setStats] = useState<AdminUserStats>(emptyStats);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await adminUserRoleAdminApi.getStats();

      if (!response.success) {
        throw new Error(response.message || 'Không thể tải thống kê.');
      }

      setStats(response.data);
    } catch (fetchError) {
      setStats(emptyStats);
      setError(getApiErrorMessage(fetchError, 'Không thể tải thống kê.'));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchStats();
  }, [fetchStats]);

  return {
    error,
    loading,
    refetch: fetchStats,
    stats,
  };
}
