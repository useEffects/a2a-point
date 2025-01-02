import { useTheme } from 'next-themes';
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
  const webColorScheme = useTheme();

  const themeMode = webColorScheme.theme ?? 'dark';
  return {
    colorScheme: themeMode === 'light' ? 'light' : 'dark',
    isDarkColorScheme: themeMode === 'dark',
    setColorScheme: (themeMode: 'light' | 'dark') =>
      webColorScheme.setTheme(themeMode),
    toggleColorScheme: () =>
      webColorScheme.setTheme(themeMode === 'light' ? 'dark' : 'light'),
    colors: themeMode === 'light' ? theme.light : theme.dark,
    palette: theme,
  } as ColorSchemeContextType;
}
