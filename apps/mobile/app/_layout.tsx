import { GestureHandlerRootView } from 'react-native-gesture-handler';
import 'react-native-reanimated';
import { Providers } from 'app/components/providers';
import '../../../packages/tailwind-theme/theme.css';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { PortalHost } from 'app/components/primitives/portal';
import * as Sentry from '@sentry/react-native';
import { HideSplashScreen } from '../components/providers/splash/hide-splash';
import { runBootstrapFunctions } from '../lib/bootstrap/app-bootstrap';
import { useSentryNavigationIntegration } from '../hooks/sentry-integration';
import { RouterProvider } from '../components/providers/router';
import { StackScreens } from '../components/providers/routes';

runBootstrapFunctions();

function RootLayout() {
  useSentryNavigationIntegration();

  return (
    <>
      <GestureHandlerRootView>
        <RouterProvider>
          <Providers>
            <SafeAreaProvider>
              <HideSplashScreen>
                <StackScreens />
                <PortalHost />
              </HideSplashScreen>
            </SafeAreaProvider>
          </Providers>
        </RouterProvider>
      </GestureHandlerRootView>
    </>
  );
}

export default Sentry.wrap(RootLayout);
