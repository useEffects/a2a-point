import { QueryClient } from "@tanstack/query-core";
import { QueryClientProviderProps, QueryClientProvider as TanstackQueryClientProvider } from "@tanstack/react-query";
import { create } from "zustand";

export const queryStore = create<QueryClient>(() => {
    return {} as QueryClient
})

export const queryClient = queryStore.getState()
export const initializeQueryClient = () => {
    const queryClient = new QueryClient()
    queryStore.setState(queryClient)
    return queryClient
}