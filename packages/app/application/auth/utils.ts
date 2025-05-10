import { tryCatch } from 'app/shared/utils/tryCatch';
import { AuthTokenSet, TokenSet } from '../../infra/queries/tokens/types';
import { DIRECTUS_URL, KC_CLIENT_ID } from 'app/lib/constants';
import { User } from 'app/lib/types';
import userStore from 'app/store/user';
import { directusStore } from 'app/store/directus';
import {
  authentication,
  createDirectus,
  rest,
  staticToken,
} from '@directus/sdk';
import { keycloakStore } from 'app/store/keycloak';
import * as Sentry from '@sentry/react-native';

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

export const initializeStores = async (tokens: AuthTokenSet) => {
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

    return true;
  } catch (error) {
    console.error('Failed to initialize stores', error);
    Sentry.captureException(error);
    return false;
  }
};
