import { QueryClient } from '@tanstack/react-query';
import { create } from 'zustand';

export const queryStore = create<QueryClient>(() => {
  return new QueryClient({
    defaultOptions: {
      mutations: {
        onError: console.error,
      },
      queries: {
        gcTime: 0,
      },
    },
  });
});

export const queryClient = queryStore.getState();
