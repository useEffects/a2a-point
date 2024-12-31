import * as WebBrowser from 'expo-web-browser';
import {
  makeRedirectUri,
  useAuthRequest,
  useAutoDiscovery,
} from 'expo-auth-session';
import { Button, Text, View } from 'react-native';
import { useContext, useEffect, useState } from 'react';
import { NEXT_URL, KC_URL, KC_REALM, KC_CLIENT_ID } from '../lib/constants';
import { keycloakStore } from 'app/store/keycloak';
import { AuthContext, authQueryKey, kcRefreshTokenKey } from 'app/context/auth';
import { useQueryClient } from '@tanstack/react-query';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthTokens } from 'app/lib/types';
import { URLSearchParams } from 'app/lib/helpers';

WebBrowser.maybeCompleteAuthSession();

export function LoginScreen({ redirect = '/' }: { redirect?: string }) {
  const queryClient = useQueryClient();
  const { active } = keycloakStore();

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

  useEffect(() => {
    if (response?.type === 'success') {
      const { code } = response.params;
      getToken({
        code: code!,
        codeVerifier: request?.codeVerifier!,
        redirectUri,
      })
        .then(async (res) => {
          const { refresh_token, access_token } = res;
          queryClient.setQueryData<AuthTokens>(authQueryKey, {
            accessToken: access_token,
            refreshToken: refresh_token,
          });
          await AsyncStorage.setItem(kcRefreshTokenKey, refresh_token);
        })
        .catch(console.error);
    } else if (response?.type === 'error') {
      console.error('Authentication error: ', response.error);
    }
  }, [response, discovery]);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      {!active && <Button title="login" onPress={() => promptAsync()}></Button>}
      {active && <Button title="logout" onPress={() => promptAsync()}></Button>}
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
