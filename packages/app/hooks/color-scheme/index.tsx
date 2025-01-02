import { useColorScheme as useNativewindColorScheme } from 'nativewind';
import { theme } from '@a2apoint/tailwind-theme/src/colors';
import { Platform } from 'react-native';
import { useMemo } from 'react';

export type ColorSchemeContextType = {
  colorScheme: 'dark' | 'light';
  isDarkColorScheme: boolean;
  setColorScheme: (colorScheme: 'dark' | 'light') => void;
  toggleColorScheme: () => void;
  colors: (typeof theme)['light' | 'dark'];
  palette: typeof theme;
};

export function useColorScheme(): ColorSchemeContextType {
  const nativeColorScheme = useNativewindColorScheme();
  const themeMode = nativeColorScheme.colorScheme ?? 'dark';

  return {
    colorScheme: themeMode === 'light' ? 'light' : 'dark',
    isDarkColorScheme: themeMode === 'dark',
    setColorScheme: (_themeMode: 'light' | 'dark') =>
      nativeColorScheme.setColorScheme(_themeMode),
    toggleColorScheme: () => nativeColorScheme.toggleColorScheme(),
    colors: themeMode === 'light' ? theme.light : theme.dark,
    palette: theme,
  } as ColorSchemeContextType;
}
