import { tryCatch } from 'app/shared/utils/tryCatch';
import { AuthTokenSet, TokenSet } from '../../infra/queries/tokens/types';
import { DIRECTUS_URL, KC_CLIENT_ID } from 'app/lib/constants';
import { User } from 'app/lib/types';
import userStore from 'app/store/user';
import { directusStore, initialDirectusStore } from 'app/store/directus';
import {
  authentication,
  createDirectus,
  rest,
  staticToken,
} from '@directus/sdk';
import { keycloakStore } from 'app/store/keycloak';
import * as Sentry from '@sentry/react-native';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { theme } from '@a2apoint/tailwind-theme/src/colors';
import Constants from 'expo-constants';

export const directusTokenFlow = async ({
  accessToken,
  refreshToken,
}: TokenSet): Promise<boolean> => {
  if (!accessToken || !refreshToken) return false;

  const [_, err] = await tryCatch(
    fetch(`${DIRECTUS_URL}/users/me?fields=['id']`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }).then((res) => res.json() as Promise<User>),
  );

  return !Boolean(err);
};

export const exchangeKcTokenWithDirectus = async (
  tokens: TokenSet,
): Promise<AuthTokenSet | null> => {
  const [newTokensRes] = await tryCatch(
    fetch(`${DIRECTUS_URL}/extended-api/exchange-keycloak-tokens`, {
      method: 'POST',
      body: JSON.stringify({
        clientId: KC_CLIENT_ID,
        ...tokens,
      }),
    }).then((res) => res.json() as Promise<AuthTokenSet>),
  );

  return newTokensRes;
};

/**
 * Run all Auth Effects on success -> stores and push notifications
 */
export const runAuthEffects = async (tokens: AuthTokenSet) => {
  try {
    const profileDetails = await fetch(
      `${DIRECTUS_URL}/users/me?fields=[*,company.*]`,
      {
        headers: {
          Authorization: `Bearer ${tokens.directusAccessToken}`,
        },
      },
    ).then((res) => res.json());

    userStore.setState({
      user: profileDetails,
    });

    directusStore.setState({
      authenticated: true,
      rest: createDirectus(DIRECTUS_URL)
        .with(rest())
        .with(authentication())
        .with(staticToken(tokens.directusAccessToken)),
    });

    keycloakStore.setState({
      active: true,
    });

    await postLoginDetails({ tokens, profileDetails });

    return true;
  } catch (error) {
    console.error('Failed to run auth effects', error);
    Sentry.captureException(error);

    userStore.setState({ user: undefined });
    keycloakStore.setState({ active: false });
    directusStore.setState(initialDirectusStore);

    return false;
  }
};

async function postLoginDetails({
  tokens,
  profileDetails,
}: {
  tokens: AuthTokenSet;
  profileDetails: Pick<User, 'id'>;
}) {
  const expoPushToken = await registerForPushNotificationsAsync();

  if (expoPushToken) {
    const loginDetailsResp = await fetch(
      `${DIRECTUS_URL}/items/login_details`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${tokens.directusAccessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          device_token: expoPushToken,
          device_model_name: Device.modelName,
          last_accessed: new Date(),
          user_id: profileDetails.id,
        }),
      },
    ).catch((err) => err);

    const loginDetailsRespJson = await loginDetailsResp.json();

    if (!loginDetailsResp.ok) {
      const errorCode = loginDetailsRespJson?.errors?.[0]?.extensions?.code;
      if (errorCode === 'RECORD_NOT_UNIQUE') {
        const filter = {
          device_token: { _eq: expoPushToken },
          user_id: { _eq: profileDetails.id },
        };

        await fetch(
          `${DIRECTUS_URL}/items/login_details?filter=${encodeURIComponent(
            JSON.stringify(filter),
          )}`,
          {
            method: 'PATCH',
            headers: {
              Authorization: `Bearer ${tokens.directusAccessToken}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              last_accessed: new Date(),
            }),
          },
        );
      } else {
        throw new Error(
          `Something failed while saving login details ${loginDetailsRespJson}`,
        );
      }
    }
  }
}

async function registerForPushNotificationsAsync() {
  let token;

  if (!Device.isDevice) {
    console.warn('Must use physical device for Push Notifications');
    return;
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') {
    console.warn('Failed to get push token for push notification!');
    return;
  }

  if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: theme.light.primary,
    });
  }
  const projectId =
    Constants?.expoConfig?.extra?.eas?.projectId ??
    Constants?.easConfig?.projectId;
  if (!projectId) {
    console.error('Project id not found');
    return;
  }

  token = Notifications.getExpoPushTokenAsync({
    projectId,
  }).then((res) => res.data);

  return token;
}
