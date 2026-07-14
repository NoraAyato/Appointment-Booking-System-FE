import { axiosClient } from '@/shared/lib/axios';
import type { ApiResponse } from '@/shared/types/api-type';

import type {
  AdminDashboardAlerts,
  AdminDashboardAppointmentDaily,
  AdminDashboardAppointmentStatusSummary,
  AdminDashboardDateRangeLimitParams,
  AdminDashboardDateRangeParams,
  AdminDashboardLimitParams,
  AdminDashboardRevenuePoint,
  AdminDashboardStaffPerformance,
  AdminDashboardTopService,
  AdminDashboardUpcomingAppointment,
} from '../types/admin-dashboard-type';

const API_URL_PREFIX = '/admin/dashboard';

export const adminDashboardRoleAdminApi = {
  getAppointmentStatusSummary: async (params: AdminDashboardDateRangeParams) => {
    const response = await axiosClient.get<ApiResponse<AdminDashboardAppointmentStatusSummary[]>>(
      `${API_URL_PREFIX}/appointments/status-summary`,
      { params },
    );

    return response.data;
  },

  getAppointmentDaily: async (params: AdminDashboardDateRangeParams) => {
    const response = await axiosClient.get<ApiResponse<AdminDashboardAppointmentDaily[]>>(
      `${API_URL_PREFIX}/appointments/daily`,
      { params },
    );

    return response.data;
  },

  getRevenue: async (params: AdminDashboardDateRangeParams) => {
    const response = await axiosClient.get<ApiResponse<AdminDashboardRevenuePoint[]>>(
      `${API_URL_PREFIX}/revenue`,
      { params },
    );

    return response.data;
  },

  getTopServices: async (params: AdminDashboardDateRangeLimitParams) => {
    const response = await axiosClient.get<ApiResponse<AdminDashboardTopService[]>>(
      `${API_URL_PREFIX}/services/top`,
      { params },
    );

    return response.data;
  },

  getStaffPerformance: async (params: AdminDashboardDateRangeLimitParams) => {
    const response = await axiosClient.get<ApiResponse<AdminDashboardStaffPerformance[]>>(
      `${API_URL_PREFIX}/staff/performance`,
      { params },
    );

    return response.data;
  },

  getAlerts: async () => {
    const response = await axiosClient.get<ApiResponse<AdminDashboardAlerts>>(
      `${API_URL_PREFIX}/alerts`,
    );

    return response.data;
  },

  getUpcomingAppointments: async (params: AdminDashboardLimitParams) => {
    const response = await axiosClient.get<ApiResponse<AdminDashboardUpcomingAppointment[]>>(
      `${API_URL_PREFIX}/appointments/upcoming`,
      { params },
    );

    return response.data;
  },
};
