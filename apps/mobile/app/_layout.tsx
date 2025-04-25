import { GestureHandlerRootView } from 'react-native-gesture-handler';
import {
  Stack,
  useGlobalSearchParams,
  useLocalSearchParams,
  useNavigation,
  useNavigationContainerRef,
  usePathname,
  useRootNavigationState,
  useRouter,
  useSegments,
} from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { ReactNode, useContext, useEffect, useState } from 'react';
import 'react-native-reanimated';
import { Providers } from 'app/components/providers';
import { AuthContext, kcRefreshTokenKey } from 'app/context/auth';
import * as navigationBar from 'expo-navigation-bar';
import { useColorScheme } from 'app/hooks/color-scheme';
import '../../../packages/tailwind-theme/theme.css';
import { Platform } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { DefaultTheme, Theme, ThemeProvider } from '@react-navigation/native';
import { RouterContext } from 'app/context/router';
import { PortalHost } from 'app/components/primitives/portal';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getVersion } from 'react-native-device-info';
import * as Sentry from '@sentry/react-native';
import { isRunningInExpoGo } from 'expo';
import { GLITCHTIP_DSN } from 'app/lib/constants';
import { prefetchQueries } from '../lib/helpers';
import * as Notifications from 'expo-notifications';

SplashScreen.preventAutoHideAsync();

const navigationIntegration = Sentry.reactNavigationIntegration({
  enableTimeToInitialDisplay: !isRunningInExpoGo(),
});

Sentry.init({
  dsn: GLITCHTIP_DSN,
  tracesSampleRate: 1.0,
  integrations: [navigationIntegration],
  enableNativeFramesTracking: !isRunningInExpoGo(),
  attachStacktrace: true,
  enabled:
    process.env.NODE_ENV === 'production' ||
    process.env.EXPO_PUBLC_NODE_ENV === 'production',
});

function RootLayout() {
  const ref = useNavigationContainerRef();
  useEffect(() => {
    if (ref?.current) {
      navigationIntegration.registerNavigationContainer(ref);
    }
  }, [ref]);

  return (
    <>
      <GestureHandlerRootView>
        <Providers>
          <RouterProvider>
            <SafeAreaProvider>
              <HideSplashScreen>
                <Stack
                  screenOptions={{
                    headerShown: false,
                  }}
                >
                  <Stack.Screen name="(main)" />

                  <Stack.Screen name="account-console" />

                  <Stack.Screen name="agents/[id]" />
                  <Stack.Screen name="agents/index" />
                  <Stack.Screen name="agents/me/activity" />
                  <Stack.Screen name="agents/me/notifications" />
                  <Stack.Screen name="agents/feedbacks/[agent]" />

                  <Stack.Screen name="chat/[id]" />

                  <Stack.Screen name="listings/[id]" />
                  <Stack.Screen name="listings/post" />

                  <Stack.Screen name="locations/[...slug]" />
                  <Stack.Screen name="locations/index" />

                  <Stack.Screen name="auth/login" />
                  <Stack.Screen name="auth/callback" />
                </Stack>
                <PortalHost />
              </HideSplashScreen>
            </SafeAreaProvider>
          </RouterProvider>
        </Providers>
      </GestureHandlerRootView>
    </>
  );
}

export default Sentry.wrap(RootLayout);

function HideSplashScreen({ children }: { children: ReactNode }) {
  const [splashScreenHidden, setSplashScreenHidden] = useState(false);
  const [queriesPrefetched, setQueriesPrefetched] = useState(false);
  const { colorScheme, setColorScheme, colors } = useColorScheme();
  const [authReady, setAuthReady] = useState(false);
  const [colorSchemeReady, setColorSchemeReady] = useState(false);
  const {
    keycloakQueryResult: {
      isLoading: isKeycloakQueryLoading,
      isFetching: isKeycloakQueryFetching,
    },
    directusQueryResult: {
      isLoading: isDirectusQueryLoading,
      isFetching: isDirectusQueryFetching,
    },
  } = useContext(AuthContext);
  const router = useContext(RouterContext).router();

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
    prefetchQueries().then(() => setQueriesPrefetched(true));
    let notificationListener: Notifications.EventSubscription;
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
      }),
    });
    notificationListener =
      Notifications.addNotificationResponseReceivedListener((response) => {
        const url = response.notification.request.content.data.url;
        if (!url) return;

        const internalPath = url.replace(/^https?:\/\/[^/]+/, '');
        router.push(internalPath);
      });
    (async () => {
      if (!colorSchemeReady) {
        const _theme = await AsyncStorage.getItem('theme');
        const theme =
          _theme === 'dark'
            ? 'dark'
            : colorScheme === 'dark'
              ? 'dark'
              : 'light';

        if (theme !== colorScheme) {
          setColorScheme(theme);
        }
        setColorSchemeReady(true);
      }
    })();

    return () => {
      if (notificationListener) {
        Notifications.removeNotificationSubscription(notificationListener);
      }
    };
  }, [router]);

  useEffect(() => {
    if (Platform.OS === 'android') {
      navigationBar.setBackgroundColorAsync(colors.accent);
      navigationBar.setButtonStyleAsync(
        colorScheme === 'dark' ? 'light' : 'dark',
      );
    }
  }, [colors]);

  useEffect(() => {
    if (
      !authReady &&
      !(
        isDirectusQueryLoading ||
        isKeycloakQueryLoading ||
        isDirectusQueryFetching ||
        isKeycloakQueryFetching
      )
    ) {
      setAuthReady(true);
    }
  }, [
    isKeycloakQueryLoading,
    isDirectusQueryLoading,
    isDirectusQueryFetching,
    isKeycloakQueryFetching,
  ]);

  useEffect(() => {
    if (
      authReady &&
      colorSchemeReady &&
      !splashScreenHidden &&
      queriesPrefetched
    ) {
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
      <StatusBar backgroundColor={colors.accent} />
    </ThemeProvider>
  );
}

export const RouterProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <RouterContext.Provider
      value={{
        router: useRouter,
        navigation: useNavigation,
        pathname: usePathname,
        segments: useSegments,
        globalSearchParams: useGlobalSearchParams,
        localSearchParams: useLocalSearchParams,
        rootNavigationState: useRootNavigationState,
      }}
    >
      {children}
    </RouterContext.Provider>
  );
};
