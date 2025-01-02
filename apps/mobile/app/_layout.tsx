import 'react-native-gesture-handler';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import {
  Stack,
  useGlobalSearchParams,
  useLocalSearchParams,
  useNavigation,
  usePathname,
  useRouter,
  useSegments,
} from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { ReactNode, useContext, useEffect, useState } from 'react';
import 'react-native-reanimated';
import { Providers } from 'app/components/providers';
import { AuthContext } from 'app/context/auth';
import * as navigationBar from 'expo-navigation-bar';
import { useColorScheme } from 'app/hooks/color-scheme';
import '../../../packages/tailwind-theme/theme.css';
import { Platform } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { storage } from 'app/lib/mmkv';
import { DefaultTheme, Theme, ThemeProvider } from '@react-navigation/native';
import { RouterContext } from 'app/context/router';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  return (
    <GestureHandlerRootView>
      <Providers>
        <SafeAreaProvider>
          <HideSplashScreen>
            <RouterProvider>
              <Stack
                screenOptions={{
                  headerShown: false,
                }}
              >
                <Stack.Screen name="(main)" />

                <Stack.Screen name="auth/login" />
                <Stack.Screen name="auth/callback" />
              </Stack>
            </RouterProvider>
          </HideSplashScreen>
        </SafeAreaProvider>
      </Providers>
    </GestureHandlerRootView>
  );
}

function HideSplashScreen({ children }: { children: ReactNode }) {
  const [splashScreenHidden, setSplashScreenHidden] = useState(false);
  const { colorScheme, setColorScheme, palette, colors } = useColorScheme();
  const [authReady, setAuthReady] = useState(false);
  const [colorSchemeReady, setColorSchemeReady] = useState(false);
  const {
    keycloakQueryResult: { isLoading: isKeycloakQueryLoading },
    directusQueryResult: { isLoading: isDirectusQueryLoading },
  } = useContext(AuthContext);

  const theme: Theme = {
    dark: colorScheme === 'dark',
    colors: {
      background: colors.background,
      border: colors.border,
      card: colors.card,
      notification: colors.accent,
      primary: colors.primary,
      text: colors.foreground,
    },
    fonts: {
      ...DefaultTheme.fonts,
    },
  };

  useEffect(() => {
    (async () => {
      if (!colorSchemeReady) {
        const _theme = storage.getString('theme');
        const theme =
          _theme === 'dark'
            ? 'dark'
            : colorScheme === 'dark'
              ? 'dark'
              : 'light';

        const colors = palette[theme];

        if (Platform.OS === 'android') {
          navigationBar.setBackgroundColorAsync(colors.card);
          navigationBar.setButtonStyleAsync(
            theme === 'dark' ? 'light' : 'dark',
          );
        }
        if (theme !== colorScheme) {
          setColorScheme(theme);
        }
        setColorSchemeReady(true);
      }
    })();
  }, []);

  useEffect(() => {
    if (!authReady && !(isDirectusQueryLoading || isKeycloakQueryLoading)) {
      setAuthReady(true);
    }
  }, [isKeycloakQueryLoading, isDirectusQueryLoading]);

  useEffect(() => {
    if (authReady && colorSchemeReady && !splashScreenHidden) {
      setSplashScreenHidden(true);
      SplashScreen.hide();
    }
  }, [
    authReady,
    colorSchemeReady,
    isDirectusQueryLoading,
    isKeycloakQueryLoading,
  ]);

  return (
    <ThemeProvider value={theme}>
      {children}
      <StatusBar backgroundColor={colors.card} />
    </ThemeProvider>
  );
}

export const RouterProvider = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const navigation = useNavigation();
  const pathname = usePathname();
  const segments = useSegments();
  const globalSearchParams = useGlobalSearchParams();
  const localSearchParams = useLocalSearchParams();

  return (
    <RouterContext.Provider
      value={{
        router,
        navigation,
        pathname,
        segments,
        globalSearchParams,
        localSearchParams,
      }}
    >
      {children}
    </RouterContext.Provider>
  );
};
