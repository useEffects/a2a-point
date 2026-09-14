import { hairlineWidth } from 'nativewind/theme';
import { tailwindColorDefinitions } from '@a2apoint/tailwind-theme/src/tailwind-config-colors';

export default {
  darkMode: 'class',
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './screens/**/*.{ts,tsx}',
    '../../packages/app/components/**/*.{ts,tsx}',
    '../../packages/app/components2/**/*.{ts,tsx}',
    '../../packages/app/screens/**/*.{ts,tsx}',
    '../../packages/app/screens2/**/*.{ts,tsx}',
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
