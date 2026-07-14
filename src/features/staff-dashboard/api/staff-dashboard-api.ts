import { axiosClient } from '@/shared/lib/axios';
import type { ApiResponse } from '@/shared/types/api-type';

import type {
  StaffDashboardDateRangeParams,
  StaffDashboardOverview,
  StaffScheduleEvent,
} from '../types/staff-dashboard-type';

const STAFF_DASHBOARD_API_PREFIX = '/staff/dashboard';

export const staffDashboardRoleStaffApi = {
  getSchedule: async (params: StaffDashboardDateRangeParams) => {
    const response = await axiosClient.get<ApiResponse<StaffScheduleEvent[]>>(
      `${STAFF_DASHBOARD_API_PREFIX}/schedule`,
      {
        params,
      },
    );

    return response.data;
  },

  getOverview: async (params: StaffDashboardDateRangeParams) => {
    const response = await axiosClient.get<ApiResponse<StaffDashboardOverview>>(
      `${STAFF_DASHBOARD_API_PREFIX}/overview`,
      {
        params,
      },
    );

    return response.data;
  },
};
