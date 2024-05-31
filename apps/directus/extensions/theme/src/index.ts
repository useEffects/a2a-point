import { defineTheme } from "@directus/extensions-sdk";
import { theme } from "tailwind-theme/src/colors"

export const generateTheme = (mode: "dark" | "light") => {
    const colors = theme[mode]
    return defineTheme({
        id: "a2apoint-dark-theme",
        name: "A2Apoint Dark Theme",
        appearance: mode,
        rules: {
            background: colors.background,
            foreground: colors.foreground,
        }
    })
}