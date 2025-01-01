import { directusUrl, portfolioUrl } from 'app/lib/constants';
import { directusStore } from 'app/store/directus';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

export const useLogin = (redirect?: string) => {
  const { authenticated } = directusStore();
  const pathname = usePathname();

  useEffect(() => {
    const handleMessage = async (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return;
      const { accessToken, refreshToken } = event.data;
      if (accessToken && refreshToken) {
        // await initialize(accessToken, refreshToken);
      }
    };

    window.addEventListener('message', handleMessage);

    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, []);

  return () => {
    const redirectUrl = `${portfolioUrl}/api/auth-redirect?appUrl=${portfolioUrl}/${redirect ?? pathname}`;
    const popup = window.open(
      `${directusUrl}/auth/login/keycloak?redirect=${redirectUrl}`,
      'login',
      'width=400,height=600',
    );

    const checkPopup = setInterval(() => {
      if (!popup || popup.closed) {
        clearInterval(checkPopup);
        return;
      }

      try {
        popup.postMessage({ message: 'check_status' }, window.location.origin);
        if (authenticated) {
          popup.close();
        }
      } catch (error) {
        // Handle potential cross-origin errors or other issues
      }
    }, 1000);
  };
};
