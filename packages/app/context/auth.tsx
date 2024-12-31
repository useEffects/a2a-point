import {
  createDirectus,
  authentication,
  rest,
  staticToken,
} from '@directus/sdk';
import AsyncStorage from '@react-native-async-storage/async-storage';
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
  NEXT_URL,
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
      if (!directusAccessTokenResp.ok) {
        console.error(await directusAccessTokenResp.json());
        setKeyCloakStore({ active: false });
        setDirectusStore(initialDirectusStore);
        throw new Error('Error getting access token from directus');
      }

      const resp = await directusAccessTokenResp.json();
      setKeyCloakStore({ active: true });
      setDirectusStore({
        authenticated: true,
        rest: createDirectus(DIRECTUS_URL)
          .with(authentication())
          .with(rest())
          .with(staticToken(resp.access_token)),
      });
      return resp;
    } else {
      setKeyCloakStore({ active: false });
      setDirectusStore(initialDirectusStore);
    }
  } catch (error) {
    console.error(error);
    setKeyCloakStore({ active: false });
    setDirectusStore(initialDirectusStore);
    throw error;
  }
};
