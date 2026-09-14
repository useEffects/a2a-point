import { useEffect } from 'react';
import { navigationIntegration } from '../lib/bootstrap/sentry';
import { useNavigationContainerRef } from 'expo-router';

export function useSentryNavigationIntegration() {
  const ref = useNavigationContainerRef();
  useEffect(() => {
    if (ref?.current) {
      navigationIntegration.registerNavigationContainer(ref);
    }
  }, [ref]);
}
