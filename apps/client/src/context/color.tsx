"use client"

import { useTheme } from "next-themes"
import { createContext, useContext } from "react"
import { theme } from "tailwind-theme/src/colors"

export const ColorContext = createContext<typeof theme["light"] | typeof theme["dark"] | undefined>(undefined)

export const ColorProvider = ({ children }: { children: React.ReactNode }) => {
    const { theme: themeMode } = useTheme()
    return <ColorContext.Provider value={themeMode ? themeMode === "dark" ? theme.dark : theme.light : undefined}>
        {children}
    </ColorContext.Provider>
}