import { QueryClient } from "@tanstack/react-query";
import { create } from "zustand";

export const queryStore = create<QueryClient>(() => {
    return new QueryClient()
})

export const queryClient = queryStore.getState()