import { defineTheme } from "@directus/extensions-sdk";
import { theme } from "../../../../../packages/tailwind-theme/src/colors"
import Color from "color"
import opacity from "hex-color-opacity";

const subdued = (color: string) => {
    return new Color(color).fade(0.5).hex()
}

const accent = (color: string) => {
    return new Color(color).saturate(0.5).hex()
}


export const generateTheme = (mode: "dark" | "light") => {
    const colors = theme[mode]
    return defineTheme({
        id: `a2apoint-${mode}-theme`,
        name: `A2Apoint ${mode === "dark" ? "Dark" : "Light"} Theme`,
        appearance: mode,
        rules: {
            background: colors.background,
            backgroundAccent: accent(colors.background),
            backgroundSubdued: subdued(colors.background),
            backgroundNormal: colors.card,

            foreground: colors.foreground,
            foregroundAccent: accent(colors.foreground),
            foregroundSubdued: subdued(colors.foreground),
            foregroundNormal: colors["card-foreground"],

            primaryBackground: opacity(colors.primary, 0.2),
            primary: colors.primary,
            primaryAccent: accent(colors.primary),
            primarySubdued: subdued(colors.primary),
            primaryNormal: colors.primary,

            secondaryBackground: opacity(colors.secondary, 0.2),
            secondary: colors.secondary,
            secondaryAccent: accent(colors.secondary),
            secondarySubdued: subdued(colors.secondary),
            secondaryNormal: colors.secondary,

            dangerBackground: opacity(colors.destructive, 0.2),
            danger: colors["destructive-foreground"],
            dangerAccent: accent(colors.destructive),
            dangerSubdued: subdued(colors.destructive),
            dangerNormal: colors.destructive,

            infoBackground: opacity(colors.info, 0.2),
            info: colors["info-foreground"],
            infoAccent: accent(colors.info),
            infoSubdued: subdued(colors.info),
            infoNormal: colors.info,

            successBackground: opacity(colors.success, 0.2),
            success: colors["secondary-foreground"],
            successAccent: accent(colors.success),
            successSubdued: subdued(colors.success),
            successNormal: colors.success,

            warningBackground: opacity(colors.warning, 0.2),
            warning: colors["warning-foreground"],
            warningAccent: accent(colors.warning),
            warningSubdued: subdued(colors.warning),
            warningNormal: colors.warning,

            borderColor: colors.border,
            borderColorAccent: accent(colors.border),
            borderColorSubdued: subdued(colors.border),

            inputColor: colors.input,
            ringColor: colors.ring,

            subtextColor: colors.subtext,

            cardColor: colors.card,
            cardForegroundColor: colors["card-foreground"],

            popoverColor: colors.popover,
            popoverForegroundColor: colors["popover-foreground"],

            mutedColor: colors.muted,
            mutedForegroundColor: colors["muted-foreground"],

            accentColor: colors.accent,
            accentForegroundColor: colors["accent-foreground"],

            navigation: {
                background: colors.card,
                backgroundAccent: accent(colors.card),
                borderColor: colors.border,
                list: {
                    divider: {
                        borderColor: colors.border
                    },
                    icon: {
                        foreground: colors.foreground,
                        foregroundActive: colors["primary-foreground"],
                        foregroundHover: colors["primary-foreground"]
                    },
                    background: colors.card,
                    foreground: colors["card-foreground"],
                    backgroundActive: colors.accent,
                    backgroundHover: colors.accent,
                    foregroundActive: colors["accent-foreground"],
                    foregroundHover: colors["accent-foreground"]
                },
                project: {
                    background: colors.card,
                    foreground: colors["card-foreground"],
                },
                modules: {
                    background: colors.popover,
                    foreground: colors["popover-foreground"],
                    button: {
                        background: colors.popover,
                        backgroundActive: colors.primary,
                        backgroundHover: colors.accent,
                        foregroundHover: colors["accent-foreground"],
                        foreground: colors.foreground,
                        foregroundActive: colors["primary-foreground"],
                    }
                }
            },

            banner: {
                background: colors.background,
                foreground: colors.foreground,
                art: {
                    background: colors.background,
                    foreground: colors.foreground
                },
                avatar: {
                    background: colors.background,
                    foreground: colors.foreground
                },
                headline: {
                    background: colors.background,
                    foreground: colors.foreground
                },
                subtitle: {
                    background: colors.background,
                    foreground: colors.foreground
                },
                title: {
                    background: colors.background,
                    foreground: colors.foreground
                }
            },

            form: {
                field: {
                    input: {
                        background: colors.background,
                        foreground: colors.foreground,
                        borderColor: colors.border,
                        placeholder: colors.subtext,
                        backgroundSubdued: subdued(colors.background),
                        borderColorFocus: colors.primary,
                        borderColorHover: colors.accent,
                        foregroundSubdued: subdued(colors.foreground),
                    },
                    label: {
                        foreground: colors.foreground,
                    },
                }
            },

            popover: {
                menu: {
                    background: colors.popover,
                    foreground: colors["popover-foreground"],
                }
            },

            public: {
                art: {
                    background: colors.background,
                    foreground: colors.foreground
                }
            }

        }
    })
}