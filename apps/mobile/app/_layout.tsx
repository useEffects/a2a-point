import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { ReactNode, useContext, useEffect, useState } from 'react';
import 'react-native-reanimated';
import { Providers } from 'app/components/providers';
import { AuthContext } from 'app/context/auth';

import { useColorScheme } from '@/hooks/useColorScheme';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  if (!loaded) {
    return null;
  }

  return (
    <Providers>
      <HideSplashScreen>
        <Stack>
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="auth" options={{ headerShown: false }} />
        </Stack>
      </HideSplashScreen>
    </Providers>
  );
}

function HideSplashScreen({ children }: { children: ReactNode }) {
  const [splashScreenHidden, setSplashScreenHidden] = useState(false);
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
    if (
      !splashScreenHidden &&
      !(
        isDirectusQueryFetching ||
        isDirectusQueryLoading ||
        isKeycloakQueryFetching ||
        isKeycloakQueryLoading
      )
    ) {
      SplashScreen.hide();
      setSplashScreenHidden(true);
    }
  }, [
    isKeycloakQueryFetching,
    isKeycloakQueryLoading,
    isDirectusQueryFetching,
    isDirectusQueryLoading,
  ]);

  return <>{children}</>;
}
