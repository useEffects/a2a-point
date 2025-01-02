import { createContext, useContext } from 'react';
import { Router } from 'expo-router';
import { NavigationProp, NavigationState } from '@react-navigation/native';

type RouterContextType = {
  router: Router;
  navigation: Omit<
    NavigationProp<ReactNavigation.RootParamList>,
    'getState'
  > & {
    getState(): NavigationState | undefined;
  };
  pathname: string;
  segments: string[];
};

export const RouterContext = createContext<RouterContextType>(
  {} as RouterContextType,
);

export const useRouter = () => {
  const context = useContext(RouterContext);

  if (!context.router) {
    throw new Error('useRouter must be used within a RouterProvider.');
  }

  return context.router;
};

export const useNavigation = () => {
  const context = useContext(RouterContext);

  if (!context.navigation) {
    throw new Error('useNavigation must be used within a RouterProvider.');
  }

  return context.navigation;
};

export const usePathname = () => {
  const context = useContext(RouterContext);

  if (!context.pathname) {
    throw new Error('usePathname must be used within a RouterProvider.');
  }

  return context.pathname;
};

export const useSegments = () => {
  const context = useContext(RouterContext);

  if (!context.segments) {
    throw new Error('useSegments must be used within a RouterProvider.');
  }

  return context.segments;
};
