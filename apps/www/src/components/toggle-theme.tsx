"use client"

import { ToggleTheme as ToggleThemeUi } from "app/components/toggle-theme"
import { useColorScheme } from "@/hooks/color-scheme"
import { useEffect, useState } from "react"

export const ToggleTheme = () => {
    const { isDarkColorScheme, toggleColorScheme } = useColorScheme()
    const [hasMounted, setHasMounted] = useState(false)
    useEffect(() => {
        setHasMounted(true)
    }, [])

    return hasMounted ? <ToggleThemeUi onPress={toggleColorScheme} isDark={isDarkColorScheme} /> : <> </>
}