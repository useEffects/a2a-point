const { tailwindColorDefinitions, typography } = require("tailwind-theme")

/** @type {import('tailwindcss').Config} */
module.exports = {
  theme: {
    extend: {
      colors: tailwindColorDefinitions,
      typography
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
  presets: [
    require('tailwindcss-preset-email'),
  ],
  plugins: [
    require("@tailwindcss/typography")
  ],
}
