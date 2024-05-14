import type { Config } from "tailwindcss"
import svgToDataUri from "mini-svg-data-uri"
import { default as flattenColorPalette } from "tailwindcss/lib/util/flattenColorPalette";
import typography from "@tailwindcss/typography"
import { tailwindColorDefinitions } from "tailwind-theme/src/tailwind-config-colors"

const config = {
  darkMode: ["class"],
  important: "html",
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
    '../../packages/app/components/**/*.{ts,tsx}',
    '../../packages/app/lib/**/*.{ts,tsx}'
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      typography: {
        DEFAULT: {
          css: {
            color: "hsl(var(--foreground))",
            '--tw-prose-body': 'hsl(var(--foreground))',
            '--tw-prose-links': 'hsl(var(--blue))',
            '--tw-prose-pre-bg': 'hsl(var(--card-background))',
            '--tw-prose-headings': 'var(--tw-prose-body)',
            '--tw-prose-bold': 'var(--tw-prose-body)',
            '--tw-prose-quotes': 'var(--tw-prose-body)',
            '--tw-prose-pre-code': 'var(--tw-prose-body)',
            '--tw-prose-code': 'var(--tw-prose-body)',
            code: {
              backgroundColor: 'var(--tw-prose-pre-bg)',
              padding: "4px",
              borderRadius: "4px",
              borderColor: "var(--tw-prose-body)",
            }
          }
        }
      },
      colors: tailwindColorDefinitions,
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"),
    addVariablesForColors,
    typography,
    function ({ matchUtilities, theme }: any) {
      matchUtilities(
        {
          "bg-grid": (value: any) => ({
            backgroundImage: `url("${svgToDataUri(
              `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="32" height="32" fill="none" stroke="${value}"><path d="M0 .5H31.5V32"/></svg>`
            )}")`,
          }),
          "bg-grid-small": (value: any) => ({
            backgroundImage: `url("${svgToDataUri(
              `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="8" height="8" fill="none" stroke="${value}"><path d="M0 .5H31.5V32"/></svg>`
            )}")`,
          }),
          "bg-dot": (value: any) => ({
            backgroundImage: `url("${svgToDataUri(
              `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="16" height="16" fill="none"><circle fill="${value}" id="pattern-circle" cx="10" cy="10" r="1.6257413380501518"></circle></svg>`
            )}")`,
          }),
        },
        { values: flattenColorPalette(theme("backgroundColor")), type: "color" }
      );
    }],
} satisfies Config

function addVariablesForColors({ addBase, theme }: any) {
  let allColors = flattenColorPalette(theme("colors"));
  let newVars = Object.fromEntries(
    Object.entries(allColors).map(([key, val]) => [`--${key}`, val])
  );

  addBase({
    ":root": newVars,
  });
}

export default config
