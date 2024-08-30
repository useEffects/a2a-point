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
        light: string;
        dark: string;
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
        light: string;
        dark: string;
    };
};

declare const tailwindColorDefinitions: {
    border: string;
    input: string;
    ring: string;
    background: string;
    foreground: string;
    primary: {
        DEFAULT: string;
        foreground: string;
    };
    secondary: {
        DEFAULT: string;
        foreground: string;
    };
    destructive: {
        DEFAULT: string;
        foreground: string;
    };
    muted: {
        DEFAULT: string;
        foreground: string;
    };
    accent: {
        DEFAULT: string;
        foreground: string;
    };
    popover: {
        DEFAULT: string;
        foreground: string;
    };
    card: {
        DEFAULT: string;
        foreground: string;
    };
    warning: {
        DEFAULT: string;
        foreground: string;
    };
    info: {
        DEFAULT: string;
        foreground: string;
    };
    success: {
        DEFAULT: string;
        foreground: string;
    };
    subtext: {
        DEFAULT: string;
    };
    light: {
        DEFAULT: string;
    };
    dark: {
        DEFAULT: string;
    };
};
declare const typography: {
    DEFAULT: {
        css: {
            '--tw-prose-body': string;
            '--tw-prose-headings': string;
            '--tw-prose-lead': string;
            '--tw-prose-links': string;
            '--tw-prose-bold': string;
            '--tw-prose-counters': string;
            '--tw-prose-bullets': string;
            '--tw-prose-hr': string;
            '--tw-prose-quotes': string;
            '--tw-prose-quote-borders': string;
            '--tw-prose-captions': string;
            '--tw-prose-code': string;
            '--tw-prose-pre-code': string;
            '--tw-prose-pre-bg': string;
            '--tw-prose-th-borders': string;
            '--tw-prose-td-borders': string;
            '--tw-prose-invert-body': string;
            '--tw-prose-invert-headings': string;
            '--tw-prose-invert-lead': string;
            '--tw-prose-invert-links': string;
            '--tw-prose-invert-bold': string;
            '--tw-prose-invert-counters': string;
            '--tw-prose-invert-bullets': string;
            '--tw-prose-invert-hr': string;
            '--tw-prose-invert-quotes': string;
            '--tw-prose-invert-quote-borders': string;
            '--tw-prose-invert-captions': string;
            '--tw-prose-invert-code': string;
            '--tw-prose-invert-pre-code': string;
            '--tw-prose-invert-pre-bg': string;
            '--tw-prose-invert-th-borders': string;
            '--tw-prose-invert-td-borders': string;
        };
    };
};

declare function generateThemeCSS(): Plugin;

export { generateThemeCSS, tailwindColorDefinitions, theme, typography };
