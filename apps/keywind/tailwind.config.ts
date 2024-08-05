import type { Config } from 'tailwindcss';
import { theme } from "tailwind-theme/src/colors";
import getPalette from "tailwindcss-palette-generator";

const { light: colors } = theme;

const palette = getPalette([
  { name: 'primary', color: colors.primary, shade: 600, shades: [100, 200, 300, 400, 500, 600, 700, 800, 900] },
  { name: 'secondary', color: colors.secondary, shade: 600, shades: [100, 200, 300, 400, 500, 600, 700, 800, 900] },
])

export default {
  content: ['./theme/**/*.ftl'],
  experimental: {
    optimizeUniversalDefaults: true,
  },
  plugins: [require('@tailwindcss/forms')],
  theme: {
    extend: {
      colors: {
        primary: palette["primary"],
        secondary: palette["secondary"],

        provider: {
          apple: '#000000',
          bitbucket: '#0052CC',
          discord: '#5865F2',
          facebook: '#1877F2',
          github: '#181717',
          gitlab: '#FC6D26',
          google: '#4285F4',
          instagram: '#E4405F',
          linkedin: '#0A66C2',
          microsoft: '#5E5E5E',
          oidc: '#F78C40',
          openshift: '#EE0000',
          paypal: '#00457C',
          slack: '#4A154B',
          stackoverflow: '#F58025',
          twitter: '#1DA1F2',
        },
      },
    },
  },
} satisfies Config;
