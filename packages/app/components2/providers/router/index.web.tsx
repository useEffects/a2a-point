'use client';

import {
  useRouter as useRouterBase,
  usePathname as usePathnameBase,
  useSearchParams as useSearchParamsBase,
} from 'next/navigation';
import { RouterContext } from 'app/context/router/index.web';

export const RouterProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <RouterContext.Provider
      value={{
        router: useRouterBase,
        pathname: usePathnameBase,
        searchParams: useSearchParamsBase,
      }}
    >
      {children}
    </RouterContext.Provider>
  );
};
