import { QueryClient } from '@tanstack/react-query';

const ONE_MINUTE = 60 * 1000;

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      gcTime: 10 * ONE_MINUTE,
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 2 * ONE_MINUTE,
    },
  },
});
