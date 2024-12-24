const { withExpo } = require('@expo/next-adapter')
const path = require('path')

/** @type {import('next').NextConfig} */
const nextConfig = {
  // reanimated (and thus, Moti) doesn't work with strict mode currently...
  // https://github.com/nandorojo/moti/issues/224
  // https://github.com/necolas/react-native-web/pull/2330
  // https://github.com/nandorojo/moti/issues/224
  // once that gets fixed, set this back to true
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  transpilePackages: [
    'app',
    'expo',
    'expo-router',
    'expo-file-system',
    'expo-modules-core',
    'react-native',
    'react-native-web',
    'solito',
    'moti',
    'react-native-reanimated',
    'react-native-vector-icons',
    'react-native-svg',
    'nativewind',
    'react-native-gesture-handler',
    'react-native-css-interop',
    'react-native-ratings',
    'react-native-tab-view',
    'react-native-autocomplete-input',
    'react-native-collapsible',
    '@idiosync/horizontal-flatlist',
    'react-native-switch',
    'react-native-lightweight-inview'
  ],
  output: 'standalone',
  webpack: config => {
    config.resolve.modules = [
      ...(config.resolve.modules || []),
      path.resolve(__dirname, '../../node_modules'),
      path.resolve(__dirname, '../../packages/app/node_modules'),
      path.resolve(__dirname, '../../packages/tailwind-theme/node_modules'),
    ]
    return config
  }
}

module.exports = withExpo(nextConfig)