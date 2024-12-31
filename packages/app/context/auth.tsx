import {
  createDirectus,
  authentication,
  rest,
  staticToken,
} from '@directus/sdk';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useQuery, UseQueryResult } from '@tanstack/react-query';
import {
  DIRECTUS_URL,
  KC_ACCESS_TOKEN_EXPIRY,
  KC_CLIENT_ID,
  KC_REALM,
  KC_URL,
  NEXT_URL,
} from 'app/lib/constants';
import { URLSearchParams } from 'app/lib/helpers';
import { AuthTokens } from 'app/lib/types';
import { directusStore, initialDirectusStore } from 'app/store/directus';
import { keycloakStore } from 'app/store/keycloak';
import { createContext, ReactNode, useEffect } from 'react';

export const AuthContext = createContext({} as UseQueryResult<AuthTokens>);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const { setKeyCloakStore } = keycloakStore();
  const { setDirectusStore } = directusStore();

  const queryResult = useQuery<AuthTokens>({
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
          console.error(error);
          return initalAuthTokensState;
        }
      }
      return initalAuthTokensState;
    },
    initialData: initalAuthTokensState,
    refetchInterval: KC_ACCESS_TOKEN_EXPIRY / 1.5,
    refetchIntervalInBackground: true,
  });

  useEffect(() => {
    (async () => {
      if (queryResult.data.accessToken && queryResult.data.refreshToken) {
        setKeyCloakStore({
          active: true,
        });
        const directusAccessTokenResp = await fetch(
          `${DIRECTUS_URL}/extended-api/exchange-keycloak-token`,
          {
            method: 'POST',
            body: JSON.stringify({
              accessToken: queryResult.data.accessToken,
              clientId: KC_CLIENT_ID
            }),
            headers: {
              'Content-Type': 'application/json',
            },
          },
        );
        if (!directusAccessTokenResp.ok) {
          console.error(await directusAccessTokenResp.json());
          throw new Error('Error getting access token from directus');
        }

        const { access_token } = await directusAccessTokenResp.json();
        setDirectusStore({
          authenticated: true,
          rest: createDirectus(DIRECTUS_URL)
            .with(authentication())
            .with(rest())
            .with(staticToken(access_token)),
        });
      } else {
        setKeyCloakStore({ active: false });
        setDirectusStore(initialDirectusStore);
      }
    })();
  }, [queryResult.data]);

  return (
    <AuthContext.Provider value={queryResult}>{children}</AuthContext.Provider>
  );
};

export const authQueryKey = ['AUTH DATA GLOBAL CONTEXT'];
export const kcRefreshTokenKey = 'kcRefreshToken';

const initalAuthTokensState: AuthTokens = {
  accessToken: '',
  refreshToken: '',
};

export const refreshKeycloakTokens = async (
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

    if (!response.ok) {
      const error = await response.json();
      console.error(error);
      throw new Error(error);
    }

    const data = await response.json();
    return {
      accessToken: data.access_token,
      refreshToken: data.refresh_token,
    };
  } catch (error) {
    console.error(error);
    throw error;
  }
};
