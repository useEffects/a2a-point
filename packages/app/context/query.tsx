'use client';

import { QueryClient, QueryClientProviderProps } from '@tanstack/react-query';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister';
import { storage } from 'app/lib/mmkv';

const asyncStoragePersister = createAsyncStoragePersister({
  storage: {
    getItem: storage.getString,
    setItem: storage.set,
    removeItem: storage.delete,
  },
});

export const QueryClientProvider = (
  props: Omit<QueryClientProviderProps, 'client'>,
) => {
  const queryClient = new QueryClient();

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
