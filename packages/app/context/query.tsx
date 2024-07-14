"use client"

import { QueryClient, QueryClientProviderProps } from "@tanstack/react-query"
import { queryStore } from "app/store/query"
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client'
import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister'
import AsyncStorage from "@react-native-async-storage/async-storage"

const asyncStoragePersister = createAsyncStoragePersister({
    storage: AsyncStorage,
})

export const QueryClientProvider = (props: Omit<QueryClientProviderProps, "client">) => {
    const queryClient = new QueryClient({
        defaultOptions: {
            queries: {
                staleTime: Number.MAX_SAFE_INTEGER,
                gcTime: Number.MAX_SAFE_INTEGER,
                refetchOnMount: "always"
            }
        },
    })
    queryStore.setState(queryClient)

    return <PersistQueryClientProvider
        {...props}
        client={queryClient}
        persistOptions={{
            persister: asyncStoragePersister,
        }}
    />
}