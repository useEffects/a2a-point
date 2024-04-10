"use client"

import { useTheme } from "next-themes"
import { createContext, useContext } from "react"
import { theme } from "tailwind-theme/src/colors"

export const ColorContext = createContext(theme.light)

export const ColorProvider = ({ children }: { children: React.ReactNode }) => {
    const { theme: themeMode } = useTheme()
    return <ColorContext.Provider value={themeMode === "dark" ? theme.dark : theme.light}>
        {children}
    </ColorContext.Provider>
}