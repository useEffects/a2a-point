import { QueryClientProviderProps, QueryClientProvider as TanstackQueryClientProvider } from "@tanstack/react-query"
import { queryStore } from "app/store/query"

export const QueryClientProvider = (props: Omit<QueryClientProviderProps, "client">) => {
    const queryClient = queryStore()
    return <TanstackQueryClientProvider {...props} client={queryClient} />
}