const { tailwindColorDefinitions } = require('tailwind-theme/src/tailwind-config-colors');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/components/**/*.html',
    './src/layouts/**/*.html',
  ],
  theme: {
    extend: {
      colors: tailwindColorDefinitions
    }
  },
  presets: [
    require('tailwindcss-preset-email'),
    require("@tailwindcss/typography")
  ],
}
