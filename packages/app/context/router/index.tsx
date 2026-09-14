import { createContext, useContext } from 'react';
import {
  useRouter as useRouterBase,
  useNavigation as useNavigationBase,
  usePathname as usePathnameBase,
  useSegments as useSegmentsBase,
  useGlobalSearchParams as useGlobalSearchParamsBase,
  useLocalSearchParams as useLocalSearchParamsBase,
  useRootNavigationState as useRootNavigationStateBase,
} from 'expo-router';

type RouterContextType = {
  router: typeof useRouterBase;
  navigation: typeof useNavigationBase;
  pathname: typeof usePathnameBase;
  segments: typeof useSegmentsBase;
  globalSearchParams: typeof useGlobalSearchParamsBase;
  localSearchParams: typeof useLocalSearchParamsBase;
  rootNavigationState: typeof useRootNavigationStateBase;
};

export const RouterContext = createContext<RouterContextType>(
  {} as RouterContextType,
);

export const useRouter = () => {
  const context = useContext(RouterContext);

  if (!context.router) {
    throw new Error('useRouter must be used within a RouterProvider.');
  }

  return context.router();
};

export const useNavigation = () => {
  const context = useContext(RouterContext);

  if (!context.navigation) {
    throw new Error('useNavigation must be used within a RouterProvider.');
  }

  return context.navigation();
};

export const usePathname = () => {
  const context = useContext(RouterContext);

  if (!context.pathname) {
    throw new Error('usePathname must be used within a RouterProvider.');
  }

  return context.pathname();
};

export const useSegments = () => {
  const context = useContext(RouterContext);

  if (!context.segments) {
    throw new Error('useSegments must be used within a RouterProvider.');
  }

  return context.segments();
};

export const useGlobalSearchParams = () => {
  const context = useContext(RouterContext);

  if (!context.globalSearchParams) {
    throw new Error(
      'useGlobalSearchParams must be used within a RouterProvider.',
    );
  }

  return context.globalSearchParams();
};

export const useLocalSearchParams = () => {
  const context = useContext(RouterContext);

  if (!context.localSearchParams) {
    throw new Error(
      'useLocalSearchParams must be used within a RouterProvider.',
    );
  }

  return context.localSearchParams();
};

export const useRootNavigationState = () => {
  const context = useContext(RouterContext);

  if (!context.rootNavigationState) {
    throw new Error(
      'useLocalSearchParams must be used within a RouterProvider.',
    );
  }

  return context.rootNavigationState();
};
