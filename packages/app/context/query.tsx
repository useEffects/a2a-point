'use client';

import { QueryClient, QueryClientProviderProps } from '@tanstack/react-query';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { queryClient } from 'app/store/query';
import { useEffect } from 'react';

const asyncStoragePersister = createAsyncStoragePersister({
  storage: AsyncStorage,
});

export const QueryClientProvider = (
  props: Omit<QueryClientProviderProps, 'client'>,
) => {
  useEffect(() => {
    queryClient.clear();
  }, []);

  return (
    <PersistQueryClientProvider
      {...props}
      client={queryClient}
      persistOptions={{
        persister: asyncStoragePersister,
      }}
    />
  );
};
