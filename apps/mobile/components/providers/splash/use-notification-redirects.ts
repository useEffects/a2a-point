import { useEffect } from 'react';
import * as Notifications from 'expo-notifications';
import { useContext } from 'react';
import { RouterContext } from 'app/context/router';

export function useNotificationRedirects() {
  const router = useContext(RouterContext).router();

  useEffect(() => {
    const sub = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        const url = response.notification.request.content.data.url;
        if (!url) return;

        const internalPath = url.replace(/^https?:\/\/[^/]+/, '');
        router.push(internalPath);
      },
    );

    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
      }),
    });

    return () => Notifications.removeNotificationSubscription(sub);
  }, [router]);
}
