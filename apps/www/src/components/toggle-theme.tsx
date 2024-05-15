"use client"

import { ToggleTheme as ToggleThemeUi } from "app/components/toggle-theme"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"

export const ToggleTheme = () => {
    const { setTheme, theme } = useTheme()
    const [hasMounted, setHasMounted] = useState(false)
    useEffect(() => {
        setHasMounted(true)
    }, [])

    const isDark = theme === "dark"
    const onPress = () => setTheme(isDark ? "light" : "dark")

    return hasMounted ? <ToggleThemeUi onPress={onPress} isDark={isDark} /> : <> </>
}