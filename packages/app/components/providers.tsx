import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from 'app/context/auth';
import { queryClient, queryStore } from 'app/store/query';
import { ReactNode, useEffect, useState } from 'react';

export const Providers = ({ children }: { children: ReactNode }) => {
  useEffect(() => {
    queryStore.setState(new QueryClient());
  }, []);

  return (
    queryClient && (
      <QueryClientProvider client={queryClient}>
        <AuthProvider>{children}</AuthProvider>
      </QueryClientProvider>
    )
  );
};
