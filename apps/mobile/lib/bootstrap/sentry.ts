import * as Sentry from '@sentry/react-native';
import { GLITCHTIP_DSN } from 'app/lib/constants';
import { isRunningInExpoGo } from 'expo';

export const navigationIntegration = Sentry.reactNavigationIntegration({
  enableTimeToInitialDisplay: !isRunningInExpoGo(),
});

export const initSentry = async () => {
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
};
