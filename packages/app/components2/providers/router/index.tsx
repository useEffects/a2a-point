import { RouterContext } from 'app/context/router';
import {
  useGlobalSearchParams,
  useLocalSearchParams,
  useNavigation,
  usePathname,
  useRootNavigationState,
  useRouter,
  useSegments,
} from 'expo-router';

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
