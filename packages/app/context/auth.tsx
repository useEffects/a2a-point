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
  directusUrl,
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
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { theme } from '@a2apoint/tailwind-theme/src/colors';
import Constants from 'expo-constants';

export const AuthContext = createContext({
  keycloakQueryResult: {} as DefinedUseQueryResult<AuthTokens>,
  directusQueryResult: {} as UseQueryResult,
  logout: async () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const { setKeyCloakStore } = keycloakStore();
  const { setDirectusStore } = directusStore();

  const logout = async () => {
    try {
      // Get the current access token (needed to perform the logout request)
      const accessToken = keycloakQueryResult.data.accessToken;
      const refreshToken = await AsyncStorage.getItem('refresh_token');

      // If there's no access token, no need to proceed with logout
      if (!accessToken) {
        console.log('No access token available, cannot log out');
        return;
      }

      // Construct the logout request URL
      const logoutUrl = `${KC_URL}/realms/${KC_REALM}/protocol/openid-connect/logout`;

      // Prepare form data for the request (session revocation)
      const formData = new URLSearchParams();
      formData.append('client_id', KC_CLIENT_ID!); // The client ID you use in Keycloak
      formData.append('refresh_token', refreshToken!); // Include refresh token for session revocation

      // Send the logout request to invalidate the session
      const response = await fetch(logoutUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Accept: 'application/json',
        },
        body: formData.toString(),
      });

      if (response.ok) {
        console.log('Session has been revoked and user logged out.');
        // Clear local session data (tokens, user info, etc.)
        await AsyncStorage.removeItem(kcRefreshTokenKey); // Optional, if you store refresh token explicitly

        // Redirect the user to the login screen or any desired screen
        // router.push('/login');
      } else {
        const json = await response.json();
        console.error('Failed to logout session: ', json);
        throw new Error(json);
      }
    } catch (e) {
      Sentry.captureException(e);
      console.error('Logout failed: ', e);
    } finally {
      setKeyCloakStore({ active: false });
      setDirectusStore(initialDirectusStore);
    }
  };

  const keycloakQueryResult = useQuery<AuthTokens>({
    queryKey: authQueryKey,
    queryFn: async () => {
      // const refreshToken = await AsyncStorage.getItem(kcRefreshTokenKey);
      // if (refreshToken) {
      //   try {
      //     const tokens = await refreshKeycloakTokens(refreshToken);
      //     if (tokens.accessToken && tokens.refreshToken) {
      //       await AsyncStorage.setItem(kcRefreshTokenKey, tokens.refreshToken);
      //       return { ...tokens };
      //     }
      //   } catch (error) {
      //     Sentry.captureException(error);
      //     console.error(error);
      //     await AsyncStorage.removeItem(kcRefreshTokenKey);
      //     return initalAuthTokensState;
      //   }
      // }
      // await AsyncStorage.removeItem(kcRefreshTokenKey);
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

  useEffect(() => {
    if (directusQueryResult.error || keycloakQueryResult.error) {
      setDirectusStore(initialDirectusStore);
      setKeyCloakStore({ active: false });
      AsyncStorage.removeItem(kcRefreshTokenKey);
    }
  }, [keycloakQueryResult.error, directusQueryResult.error]);

  return (
    <AuthContext.Provider
      value={{ keycloakQueryResult, directusQueryResult, logout }}
    >
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
) => {};

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

  token = (
    await Notifications.getExpoPushTokenAsync({
      projectId,
    })
  ).data;
  return token;
}
