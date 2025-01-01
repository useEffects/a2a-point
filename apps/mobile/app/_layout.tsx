import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { ReactNode, useContext, useEffect, useState } from 'react';
import 'react-native-reanimated';
import { Providers } from 'app/components/providers';
import { AuthContext } from 'app/context/auth';
import * as navigationBar from 'expo-navigation-bar';
import { useColorScheme } from 'app/hooks/color-scheme';
import AsyncStorage from '@react-native-async-storage/async-storage';
import '../../../packages/tailwind-theme/theme.css';
import { Platform } from 'react-native';
import { StatusBar } from 'expo-status-bar';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  return (
    <Providers>
      <HideSplashScreen>
        <Stack
          screenOptions={{
            headerShown: false,
          }}
        >
          <Stack.Screen name="(main)" />
          <Stack.Screen name="auth" />
        </Stack>
      </HideSplashScreen>
      <StatusBar />
    </Providers>
  );
}

function HideSplashScreen({ children }: { children: ReactNode }) {
  const [splashScreenHidden, setSplashScreenHidden] = useState(false);
  const { colorScheme, setColorScheme, palette } = useColorScheme();
  const [authReady, setAuthReady] = useState(false);
  const [colorSchemeReady, setColorSchemeReady] = useState(false);
  const {
    keycloakQueryResult: {
      isFetching: isKeycloakQueryFetching,
      isLoading: isKeycloakQueryLoading,
    },
    directusQueryResult: {
      isFetching: isDirectusQueryFetching,
      isLoading: isDirectusQueryLoading,
    },
  } = useContext(AuthContext);

  useEffect(() => {
    if (!colorSchemeReady) {
      AsyncStorage.getItem('theme')
        .then(async (_theme) => {
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
          setColorScheme(theme);
          setColorSchemeReady(true);
        })
        .catch(console.error);
    }
  }, []);

  useEffect(() => {
    if (
      !authReady &&
      !(
        isDirectusQueryFetching ||
        isDirectusQueryLoading ||
        isKeycloakQueryFetching ||
        isKeycloakQueryLoading
      )
    ) {
      setAuthReady(true);
    }
  }, [
    isKeycloakQueryFetching,
    isKeycloakQueryLoading,
    isDirectusQueryFetching,
    isDirectusQueryLoading,
  ]);

  useEffect(() => {
    if (authReady && colorSchemeReady && !splashScreenHidden) {
      setSplashScreenHidden(true);
      SplashScreen.hide();
    }
  }, [authReady, colorSchemeReady]);

  return <>{children}</>;
}
