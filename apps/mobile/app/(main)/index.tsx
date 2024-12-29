import * as WebBrowser from 'expo-web-browser';
import { makeRedirectUri, useAuthRequest, useAutoDiscovery } from 'expo-auth-session';
import { Button, Text, View } from 'react-native';
import { useEffect, useState } from 'react';
import { NEXT_URL, KC_URL, KC_REALM } from '../../lib/constants';
import { keycloakStore } from 'app/store/keycloak';
import AsyncStorage from '@react-native-async-storage/async-storage';

WebBrowser.maybeCompleteAuthSession();

export default function App() {
  const { initializeWithRefresh, initialize, accessToken, refreshToken } = keycloakStore();
  const discovery = useAutoDiscovery(`${KC_URL}/realms/${KC_REALM}`);
  const redirectUri = makeRedirectUri({
    path: '/auth/callback',
  });
  const [shouldAuthenticate, setShouldAuthenticate] = useState(false);

  const [request, response, promptAsync] = useAuthRequest(
    {
      clientId: 'a2apoint-dev',
      redirectUri,
      scopes: ['openid', 'profile', 'offline_access'],
      responseType: 'code',
    },
    discovery,
  );

  useEffect(() => {
    if (response?.type === 'success') {
      const { code } = response.params;
      fetch(`${NEXT_URL}/api/keycloak/exchange`, {
        method: 'POST',
        body: JSON.stringify({
          redirectUri,
          code: code,
          codeVerifier: request?.codeVerifier,
        }),
      })
        .then(async (res) => {
          if (res.ok) {
            const json = await res.json();
            const { refresh_token, access_token } = json;
            initialize({ refreshToken: refresh_token, accessToken: access_token });
          }
        })
        .catch(console.error);
    } else if (response?.type === 'error') {
      console.error('Authentication error: ', response.error);
    }
  }, [response, discovery]);

  useEffect(() => {
    (async () => {
      const kcRefreshToken = await AsyncStorage.getItem('kcRefreshToken');
      const refreshTokenSuccessful = await initializeWithRefresh(kcRefreshToken);
      if (!refreshTokenSuccessful) {
        setShouldAuthenticate(true);
      }
    })();
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Button title="Login!" disabled={!request && shouldAuthenticate} onPress={() => promptAsync()} />
      <Text>{accessToken}</Text>
      <Text>{refreshToken}</Text>
    </View>
  );
}
