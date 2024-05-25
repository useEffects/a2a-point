"use client"

import { ToggleTheme as ToggleThemeUi } from "app/components/toggle-theme"
import { useEffect, useState } from "react"
import { useColorScheme } from "src/hooks/color-scheme"

export const ToggleTheme = () => {
    const { isDarkColorScheme, toggleColorScheme } = useColorScheme()
    const [hasMounted, setHasMounted] = useState(false)
    useEffect(() => {
        setHasMounted(true)
    }, [])

    return hasMounted ? <ToggleThemeUi onPress={toggleColorScheme} isDark={isDarkColorScheme} /> : <> </>
}