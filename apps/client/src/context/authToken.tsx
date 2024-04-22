"use client"

import { ReactNode, createContext, useState } from "react";

export const AuthTokenContext = createContext({
    token: "",
    setToken: (token: string) => { }
})

export const AuthTokenProvider = ({ children }: { children: ReactNode }) => {
    const [token, setToken] = useState("");

    return <AuthTokenContext.Provider value={{ token, setToken }}>
        { children }
    </AuthTokenContext.Provider>
}