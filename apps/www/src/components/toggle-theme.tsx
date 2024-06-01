"use client"

import { ToggleTheme as ToggleThemeUi } from "app/components/toggle-theme"
import { useEffect, useState } from "react"

export const ToggleTheme = () => {
    const [hasMounted, setHasMounted] = useState(false)
    useEffect(() => {
        setHasMounted(true)
    }, [])

    return hasMounted ? <ToggleThemeUi /> : <> </>
}