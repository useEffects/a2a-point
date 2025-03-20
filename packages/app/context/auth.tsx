import {
  createDirectus,
  authentication,
  rest,
  staticToken,
} from '@directus/sdk';
import {
  DefinedUseQueryResult,
  useQuery,
  UseQueryResult,
} from '@tanstack/react-query';
import {
  DIRECTUS_URL,
  KC_ACCESS_TOKEN_EXPIRY,
  KC_CLIENT_ID,
  KC_REALM,
  KC_URL,
} from 'app/lib/constants';
import { URLSearchParams } from 'app/lib/helpers';
import { AuthTokens } from 'app/lib/types';
import {
  DirectusStore,
  directusStore,
  initialDirectusStore,
} from 'app/store/directus';
import { KeycloakStore, keycloakStore } from 'app/store/keycloak';
import { createContext, ReactNode, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import userStore from 'app/store/user';
import * as Sentry from '@sentry/react-native';

export const AuthContext = createContext({
  keycloakQueryResult: {} as DefinedUseQueryResult<AuthTokens>,
  directusQueryResult: {} as UseQueryResult,
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const { setKeyCloakStore } = keycloakStore();
  const { setDirectusStore } = directusStore();

  const keycloakQueryResult = useQuery<AuthTokens>({
    queryKey: authQueryKey,
    queryFn: async () => {
      const refreshToken = await AsyncStorage.getItem(kcRefreshTokenKey);
      if (refreshToken) {
        try {
          const tokens = await refreshKeycloakTokens(refreshToken);
          if (tokens.accessToken && tokens.refreshToken) {
            await AsyncStorage.setItem(kcRefreshTokenKey, tokens.refreshToken);
            return { ...tokens };
          }
        } catch (error) {
          Sentry.captureException(error);
          console.error(error);
          await AsyncStorage.removeItem(kcRefreshTokenKey);
          return initalAuthTokensState;
        }
      }
      return initalAuthTokensState;
    },
    initialData: initalAuthTokensState,
    refetchInterval: KC_ACCESS_TOKEN_EXPIRY / 1.5,
    refetchIntervalInBackground: true,
  });

  const directusQueryResult = useQuery({
    queryKey: ['DIRECTUS GLOBAL CONTEXT', keycloakQueryResult.data],
    queryFn: async () =>
      authOnSuccess(
        { ...keycloakQueryResult.data },
        setKeyCloakStore,
        setDirectusStore,
      ),
    enabled: Boolean(
      keycloakQueryResult.data.accessToken &&
        keycloakQueryResult.data.refreshToken,
    ),
  });

  return (
    <AuthContext.Provider value={{ keycloakQueryResult, directusQueryResult }}>
      {children}
    </AuthContext.Provider>
  );
};

export const authQueryKey = ['AUTH DATA GLOBAL CONTEXT'];
export const kcRefreshTokenKey = 'kcRefreshToken';

const initalAuthTokensState: AuthTokens = {
  accessToken: '',
  refreshToken: '',
};

const refreshKeycloakTokens = async (
  refreshToken: string,
): Promise<AuthTokens> => {
  const tokenEndpoint = `${KC_URL}/realms/${KC_REALM}/protocol/openid-connect/token`;

  const body = new URLSearchParams();
  body.append('grant_type', 'refresh_token');
  body.append('refresh_token', refreshToken);
  body.append('client_id', KC_CLIENT_ID!);

  try {
    const response = await fetch(tokenEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: body.toString(),
    });

    const respJson = await response.json();

    if (!response.ok) {
      Sentry.captureMessage(respJson);
      console.error(respJson);
      throw new Error(respJson);
    }

    return {
      accessToken: respJson.access_token,
      refreshToken: respJson.refresh_token,
    };
  } catch (error) {
    Sentry.captureException(error);
    console.error(error);
    throw error;
  }
};

export const authOnSuccess = async (
  { accessToken, refreshToken }: AuthTokens,
  setKeyCloakStore: (props: Partial<KeycloakStore>) => void,
  setDirectusStore: (props: Partial<DirectusStore>) => void,
) => {
  try {
    if (accessToken && refreshToken) {
      const directusAccessTokenResp = await fetch(
        `${DIRECTUS_URL}/extended-api/exchange-keycloak-token`,
        {
          method: 'POST',
          body: JSON.stringify({
            accessToken: accessToken,
            clientId: KC_CLIENT_ID,
          }),
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );
      const directusAccessTokenRespJson = await directusAccessTokenResp.json();
      if (!directusAccessTokenResp.ok) {
        Sentry.captureMessage(directusAccessTokenRespJson);
        console.error(directusAccessTokenRespJson);
        setKeyCloakStore({ active: false });
        setDirectusStore(initialDirectusStore);
        throw new Error('Error getting access token from directus');
      }

      const { access_token: directusAccessToken } = directusAccessTokenRespJson;

      const usersFetchResp = await fetch(`${DIRECTUS_URL}/users/me?fields=*`, {
        headers: {
          Authorization: `Bearer ${directusAccessToken}`,
        },
      });

      if (usersFetchResp.ok) {
        const { data: user } = await usersFetchResp.json();
        userStore.setState((p) => ({
          ...p,
          user: user,
        }));
        if (user.company) {
          const company = await fetch(
            `${DIRECTUS_URL}/items/companies/${user.company}`,
            {
              headers: {
                Authorization: `Bearer ${directusAccessToken}`,
              },
            },
          )
            .then((res) => res.json())
            .then((res) => res.data);
          userStore.setState((p) => ({
            ...p,
            company: company,
          }));
        }
        if (user.document) {
          const document = await fetch(
            `${DIRECTUS_URL}/items/documents/${user.document}`,
            {
              headers: {
                Authorization: `Bearer ${directusAccessToken}`,
              },
            },
          )
            .then((res) => res.json())
            .then((res) => res.data);
          userStore.setState((p) => ({ ...p, document: document }));
        }
      } else {
        Sentry.captureMessage('Unable to fetch users data');
        console.error('Unable to fetch users data');
      }

      setKeyCloakStore({ active: true });
      setDirectusStore({
        authenticated: true,
        rest: createDirectus(DIRECTUS_URL)
          .with(authentication())
          .with(rest())
          .with(staticToken(directusAccessToken)),
      });
      return directusAccessTokenResp;
    } else {
      setKeyCloakStore({ active: false });
      setDirectusStore(initialDirectusStore);
    }
  } catch (error) {
    setKeyCloakStore({ active: false });
    setDirectusStore(initialDirectusStore);
    console.error(error);
    throw error;
  }
};
