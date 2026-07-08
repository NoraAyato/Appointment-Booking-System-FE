import axios from 'axios';
import type { AxiosError, AxiosRequestConfig, InternalAxiosRequestConfig } from 'axios';

import type { ApiResponse } from '@/shared/types/api-type';

interface RetryRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

const AUTH_ENDPOINTS = ['/auth/login', '/auth/register', '/auth/refresh-token', '/auth/logout'];

const axiosConfig: AxiosRequestConfig = {
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
};

export const axiosClient = axios.create(axiosConfig);

// Keep this client without response interceptors so refresh requests cannot recursively trigger refresh.
const refreshAxiosClient = axios.create(axiosConfig);

let isRefreshing = false;
let requestQueue: Array<{
  resolve: () => void;
  reject: (reason?: unknown) => void;
}> = [];

const isAuthEndpoint = (url?: string) => {
  if (!url) {
    return false;
  }

  return AUTH_ENDPOINTS.some((endpoint) => url.includes(endpoint));
};

const isRefreshableAuthError = (status?: number) => status === 401;

const flushRequestQueue = (error?: unknown) => {
  requestQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
      return;
    }

    resolve();
  });
  requestQueue = [];
};

axiosClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as RetryRequestConfig | undefined;

    if (
      !originalRequest ||
      !isRefreshableAuthError(error.response?.status) ||
      originalRequest._retry ||
      isAuthEndpoint(originalRequest.url)
    ) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        requestQueue.push({
          resolve: () => resolve(axiosClient(originalRequest)),
          reject,
        });
      });
    }

    isRefreshing = true;

    try {
      await refreshAxiosClient.post<ApiResponse<unknown>>('/auth/refresh-token');
      flushRequestQueue();

      return axiosClient(originalRequest);
    } catch (refreshError) {
      flushRequestQueue(refreshError);
      window.dispatchEvent(new Event('auth:expired'));

      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  },
);
