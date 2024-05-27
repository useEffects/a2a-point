import { hairlineWidth } from 'nativewind/theme'
import { tailwindColorDefinitions } from "tailwind-theme/src/tailwind-config-colors"

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    "../../packages/app/**/*.{ts,tsx}",
    "./screens/**/*.{ts,tsx}",
  ],
  presets: [require('nativewind/preset')],
  corePlugin: {
    backgroundOpacity: true,
  },
  theme: {
    extend: {
      colors: {
        ...tailwindColorDefinitions
      },
      borderWidth: {
        hairline: hairlineWidth(),
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};
