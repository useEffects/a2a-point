"use client"

import { ReactNode } from "react"
import { SessionProvider as Provider } from "next-auth/react"

export const SessionProvider = ({ children }: { children: ReactNode }) => {
    return <Provider>
        {children}
    </Provider>
}