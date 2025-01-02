import * as WebBrowser from 'expo-web-browser';
import {
  makeRedirectUri,
  useAuthRequest,
  useAutoDiscovery,
} from 'expo-auth-session';
import { View } from 'react-native';
import { useContext, useEffect, useState } from 'react';
import { NEXT_URL, KC_URL, KC_REALM, KC_CLIENT_ID } from 'app/lib/constants';
import { keycloakStore } from 'app/store/keycloak';
import {
  AuthContext,
  authOnSuccess,
  authQueryKey,
  kcRefreshTokenKey,
} from 'app/context/auth';
import { useQueryClient } from '@tanstack/react-query';
import { AuthTokens } from 'app/lib/types';
import { URLSearchParams } from 'app/lib/helpers';
import { directusStore, initialDirectusStore } from 'app/store/directus';
import { Button } from 'app/components/ui/button';
import { Text } from 'app/components/ui/text';
import { storage } from 'app/lib/mmkv';

WebBrowser.maybeCompleteAuthSession();

export function LoginScreen({ redirect = '/' }: { redirect?: string }) {
  const { active, setKeyCloakStore } = keycloakStore();
  const { setDirectusStore } = directusStore();
  const {
    keycloakQueryResult: {
      data: { accessToken },
    },
  } = useContext(AuthContext);

  const discovery = useAutoDiscovery(`${KC_URL}/realms/${KC_REALM}`);
  const redirectUri = makeRedirectUri({
    path: `auth/callback?redirect=${redirect}`,
  });

  const [request, response, promptAsync] = useAuthRequest(
    {
      clientId: KC_CLIENT_ID!,
      redirectUri,
      scopes: ['openid', 'profile', 'offline_access'],
      responseType: 'code',
    },
    discovery,
  );

  const logout = async () => {
    try {
      const res = await fetch(
        `${KC_URL}/realms/${KC_REALM}/protocol/openid-connect/logout?client_id=${KC_CLIENT_ID}`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
      if (res.ok) {
        setDirectusStore(initialDirectusStore);
        setKeyCloakStore({ active: false });
        storage.delete(kcRefreshTokenKey);
      }
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  useEffect(() => {
    if (response?.type === 'success') {
      const { code } = response.params;
      getToken({
        code: code!,
        codeVerifier: request?.codeVerifier!,
        redirectUri,
      })
        .then(async (res) => {
          const { refresh_token: refreshToken, access_token: accessToken } =
            res;
          authOnSuccess(
            { accessToken, refreshToken },
            setKeyCloakStore,
            setDirectusStore,
          );
          storage.set(kcRefreshTokenKey, refreshToken);
        })
        .catch(console.error);
    } else if (response?.type === 'error') {
      console.error('Authentication error: ', response.error);
    }
  }, [response, discovery]);

  return (
    <View className="bg-background w-full h-full flex-1 justify-center items-center">
      {!active && (
        <Button onPress={() => promptAsync()}>
          <Text>Login</Text>
        </Button>
      )}
      {active && (
        <Button onPress={logout}>
          <Text>Logout</Text>
        </Button>
      )}
    </View>
  );
}

export const getToken = async ({
  code,
  codeVerifier,
  redirectUri,
}: {
  code: string;
  codeVerifier: string;
  redirectUri: string;
}) => {
  try {
    const formParams = new URLSearchParams();
    formParams.append('grant_type', 'authorization_code');
    formParams.append('client_id', KC_CLIENT_ID!);
    formParams.append('code', code);
    formParams.append('code_verifier', codeVerifier);
    formParams.append('redirect_uri', redirectUri);

    const response = await fetch(
      `${KC_URL}/realms/${KC_REALM}/protocol/openid-connect/token`,
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formParams.toString(),
      },
    );
    if (response.ok) {
      return response.json();
    } else {
      const json = await response.json();
      console.error(json);
      throw new Error(json);
    }
  } catch (e) {
    console.error(e);
    throw e;
  }
};
