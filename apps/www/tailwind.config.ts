import type { Config } from "tailwindcss"
import { tailwindColorDefinitions } from "@a2apoint/tailwind-theme/src/tailwind-config-colors"

const config = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
    '../../packages/**/*.{ts,tsx}'
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
    fontSize: {
      sm: '0.8rem',
      base: '1rem',
      xl: '1.25rem',
      '2xl': '1.563rem',
      '3xl': '1.953rem',
      '4xl': '2.441rem',
      '5xl': '3.052rem',
      '6xl': '3.815rem',
      '7xl': '4.768rem',
      '8xl': '5.96rem',
      '9xl': '7.451rem',
    },
    screens: {
      '3xs': '360px',   // iPhone 6, 7, 8, X, 11, 12 / Galaxy S8 / HTC One
      '2xs': '480px',   // Blackberry Passport / Amazon Kindle Fire HD 7
      'xs': '600px',    // LG G Pad 8.3 / Amazon Kindle Fire
      'sm': '768px',    // Microsoft Surface / iPad Pro 9.7 / iPad Mini
      'md': '1024px',   // iPad Pro 12.9 / Microsoft Surface Pro 3
      'lg': '1280px',   // Google Chromebook Pixel / Samsung Chromebook
      'xl': '1440px',   // Macbook Air 2020 M1 / MacBook Pro 15
      '2xl': '1600px',  // Dell Inspiron 14 series
      '3xl': '1920px',  // Dell UltraSharp U2412M / Dell S2340M / Apple iMac 21.5-inch
      '4xl': '2560px',  // Dell UltraSharp U2711 / Apple iMac 27-inch
    }
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config

export default config