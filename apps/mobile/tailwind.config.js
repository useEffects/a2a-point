import { hairlineWidth } from 'nativewind/theme'
import { tailwindColorDefinitions } from "@a2apoint/tailwind-theme/src/tailwind-config-colors"
import plugin from "tailwindcss/plugin"
import defaultTheme from "tailwindcss/defaultTheme"

export default {
  darkMode: 'class',
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    "../../packages/app/components/**/*.{ts,tsx}",
    "../../packages/app/screens/**/*.{ts,tsx}",
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
      fontSize: {
        lg: [defaultTheme.fontSize.lg[0], { ...defaultTheme.fontSize.lg[1], fontFamily: 'Poppins_400Regular, sans-serif' }],
        xl: [defaultTheme.fontSize.xl[0], { ...defaultTheme.fontSize.xl[1], fontFamily: 'Poppins_400Regular, sans-serif' }],
        '2xl': [defaultTheme.fontSize['2xl'][0], { ...defaultTheme.fontSize['2xl'][1], fontFamily: 'Poppins_400Regular, sans-serif' }],
        '3xl': [defaultTheme.fontSize['3xl'][0], { ...defaultTheme.fontSize['3xl'][1], fontFamily: 'Poppins_400Regular, sans-serif' }],
        '4xl': [defaultTheme.fontSize['4xl'][0], { ...defaultTheme.fontSize['4xl'][1], fontFamily: 'Poppins_400Regular, sans-serif' }],
      },
    },
  },
  plugins: [
    require('tailwindcss-animate'),
    plugin(function ({ addUtilities, theme, e }) {
      const newUtilities = {}
      const fontClasses = ["text-lg", "text-xl", "text-2xl", "text-4xl"]
      fontClasses.forEach((fontClass) => {
        newUtilities[`.${e(`font-${fontClass}`)}`] = {
          fontFamily: 'Poppins_400Regular, sans-serif',
        }
      })
      addUtilities(newUtilities, { respectImportant: true, respectPrefix: true })
    })
  ],
};
