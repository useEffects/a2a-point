import { hairlineWidth } from 'nativewind/theme';
import { tailwindColorDefinitions } from '@a2apoint/tailwind-theme/src/tailwind-config-colors';
import plugin from 'tailwindcss/plugin';
import defaultTheme from 'tailwindcss/defaultTheme';

export default {
  darkMode: 'class',
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    '../../packages/app/components/**/*.{ts,tsx}',
    '../../packages/app/screens/**/*.{ts,tsx}',
    './screens/**/*.{ts,tsx}',
  ],
  presets: [require('nativewind/preset')],
  corePlugin: {
    backgroundOpacity: true,
  },
  theme: {
    extend: {
      colors: {
        ...tailwindColorDefinitions,
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
