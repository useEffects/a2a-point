const { withExpo } = require('@expo/next-adapter')

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
  transpilePackages: [
    'app',
    'expo-router',
    'react-native',
    'react-native-web',
    'solito',
    'moti',
    'react-native-reanimated',
    'react-native-svg',
    'nativewind',
    'react-native-gesture-handler',
    'react-native-css-interop',
    'react-native-vector-icons',
    'react-native-ratings',
    'react-native-tab-view',
    'react-native-autocomplete-input',
    'react-native-collapsible',
    '@idiosync/horizontal-flatlist'
  ],
}

module.exports = withExpo(nextConfig)