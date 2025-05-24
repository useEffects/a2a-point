import { SplashScreen } from 'expo-router';
import { initSentry } from './sentry';

export const runBootstrapFunctions = () => {
  initSentry();
  SplashScreen.preventAutoHideAsync().then(console.warn);
};
