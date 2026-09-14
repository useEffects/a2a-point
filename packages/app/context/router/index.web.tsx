import { createContext, useContext } from "react";
import {
  useRouter as useRouterBase,
  usePathname as usePathnameBase,
  useSearchParams as useSearchParamsBase,
} from "next/navigation";

type RouterContextType = {
  router: typeof useRouterBase;
  pathname: typeof usePathnameBase;
  searchParams: typeof useSearchParamsBase;
};

export const RouterContext = createContext<RouterContextType>(
  {} as RouterContextType
);

export const useRouter = () => {
  const context = useContext(RouterContext);

  if (!context.router) {
    throw new Error("useRouter must be used within a RouterProvider.");
  }

  return context.router();
};

export const useNavigation = () => {
  // Next.js doesn’t expose a separate navigation object like Expo
  // We just alias to router here for API compatibility
  const context = useContext(RouterContext);

  if (!context.router) {
    throw new Error("useNavigation must be used within a RouterProvider.");
  }

  return context.router();
};

export const usePathname = () => {
  const context = useContext(RouterContext);

  if (!context.pathname) {
    throw new Error("usePathname must be used within a RouterProvider.");
  }

  return context.pathname();
};

export const useSegments = () => {
  const pathname = usePathname();
  return pathname.split("/").filter(Boolean);
};

export const useGlobalSearchParams = () => {
  const context = useContext(RouterContext);

  if (!context.searchParams) {
    throw new Error("useGlobalSearchParams must be used within a RouterProvider.");
  }

  return context.searchParams();
};

export const useLocalSearchParams = () => {
  // In Next.js, local/global params are the same (via `useSearchParams`)
  return useGlobalSearchParams();
};

export const useRootNavigationState = () => {
  // Next.js doesn’t have a root navigation state
  // You might stub this or throw for parity
  throw new Error("useRootNavigationState is not available in Next.js.");
};
