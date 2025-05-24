import { ReactNode, useEffect, useState } from 'react';
import { useAuthReady } from './use-auth-ready';
import { useColorSchemeBootstrap } from './use-colorscheme-bootstrap';
import { usePrefetchQueries } from './use-prefetchqueries';
import { useColorScheme } from 'app/hooks/color-scheme';
import { DefaultTheme, Theme, ThemeProvider } from '@react-navigation/native';
import { SplashScreen } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useNotificationRedirects } from './use-notification-redirects';
import { useAndroidNavigationBarStyling } from './use-android-navigation-bar-styling';

export const HideSplashScreen = ({ children }: { children: ReactNode }) => {
  const queriesReady = usePrefetchQueries();
  const colorReady = useColorSchemeBootstrap();
  const authReady = useAuthReady();

  useNotificationRedirects();
  useAndroidNavigationBarStyling();

  const { colorScheme, colors } = useColorScheme();
  const [hidden, setHidden] = useState(false);

  const theme: Theme = {
    dark: colorScheme === 'dark',
    colors: {
      background: colors.background,
      border: colors.border,
      card: colors.accent,
      notification: colors.accent,
      primary: colors.primary,
      text: colors.foreground,
    },
    fonts: {
      ...DefaultTheme.fonts,
    },
  };

  useEffect(() => {
    if (!hidden && authReady && colorReady && queriesReady) {
      SplashScreen.hideAsync();
      setHidden(true);
    }
  }, [authReady, colorReady, queriesReady]);

  return (
    <ThemeProvider value={theme}>
      {children}
      <StatusBar backgroundColor={colors.accent} />
    </ThemeProvider>
  );
};
