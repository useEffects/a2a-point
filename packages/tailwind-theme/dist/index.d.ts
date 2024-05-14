import { Plugin } from 'postcss';

declare const theme: {
    light: {
        background: string;
        foreground: string;
        card: string;
        "card-foreground": string;
        popover: string;
        "popover-foreground": string;
        primary: string;
        "primary-foreground": string;
        secondary: string;
        "secondary-foreground": string;
        muted: string;
        "muted-foreground": string;
        accent: string;
        "accent-foreground": string;
        destructive: string;
        "destructive-foreground": string;
        info: string;
        "info-foreground": string;
        success: string;
        "success-foreground": string;
        warning: string;
        "warning-foreground": string;
        border: string;
        input: string;
        ring: string;
        subtext: string;
    };
    dark: {
        background: string;
        foreground: string;
        card: string;
        "card-foreground": string;
        popover: string;
        "popover-foreground": string;
        primary: string;
        "primary-foreground": string;
        secondary: string;
        "secondary-foreground": string;
        muted: string;
        "muted-foreground": string;
        accent: string;
        "accent-foreground": string;
        destructive: string;
        "destructive-foreground": string;
        info: string;
        "info-foreground": string;
        success: string;
        "success-foreground": string;
        warning: string;
        "warning-foreground": string;
        border: string;
        input: string;
        ring: string;
        subtext: string;
    };
};

declare function generateThemeCSS(): Plugin;

export { generateThemeCSS, theme };
