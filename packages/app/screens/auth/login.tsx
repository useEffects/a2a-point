import {
  makeRedirectUri,
  useAuthRequest,
  useAutoDiscovery,
} from 'expo-auth-session';
import { Image, View } from 'react-native';
import { useContext, useEffect } from 'react';
import { KC_URL, KC_REALM, KC_CLIENT_ID } from 'app/lib/constants';
import { keycloakStore } from 'app/store/keycloak';
import {
  AuthContext,
  authOnSuccess,
  kcRefreshTokenKey,
} from 'app/context/auth';
import { URLSearchParams } from 'app/lib/helpers';
import { directusStore } from 'app/store/directus';
import { Button } from 'app/components/ui/button';
import { Text } from 'app/components/ui/text';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BackButton, Header, HeaderTitle } from 'app/components/header';
import Logo from 'app/components/svg/logo';
import * as Linking from 'expo-linking';
import { useColorScheme } from 'app/hooks/color-scheme';
import LoginDarkImg from 'app/assets/login/dark/Frame_135_2_hzjyas_c_scale,w_1085.jpg';
import LoginLightImg from 'app/assets/login/light/light_c9pqo8_c_scale,w_1029.jpg';
import { useRouter } from 'app/context/router';
import * as Sentry from '@sentry/react-native';

export function LoginScreen({ redirect = '/' }: { redirect?: string }) {
  const router = useRouter();
  const { setKeyCloakStore } = keycloakStore();
  const { setDirectusStore } = directusStore();
  const { logout } = useContext(AuthContext);

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

  const { isDarkColorScheme } = useColorScheme();

  const handleLogin = () => {
    logout().then(() => promptAsync());
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
          await AsyncStorage.setItem(kcRefreshTokenKey, refreshToken);
          router.push(`auth/callback?redirect=${redirect}`);
        })
        .catch(Sentry.captureException);
    } else if (response?.type === 'error') {
      Sentry.captureException(response.error);
      console.error('Authentication error: ', response.error);
    } else {
      // console.log(response);
    }
  }, [response, discovery]);

  return (
    <View className="flex-1 grow">
      <View className="flex-col justify-evenly flex-1 items-start px-4 py-8">
        <View className="flex-col items-center w-full">
          <Text className="text-2xl font-bold">
            Welcome to <Text className="text-2xl text-primary">A2APoint</Text>
          </Text>
          <Text>For more information visit</Text>
          <Button
            onPress={() => Linking.openURL('https://a2apoint.com')}
            size={'none'}
            variant={'base'}
          >
            <Text className="text-info underline">https://a2apoint.com</Text>
          </Button>
        </View>
        <View className="flex-row justify-center w-full relative h-[350px]">
          <Image
            source={isDarkColorScheme ? LoginDarkImg : LoginLightImg}
            style={{ width: 350, height: 350 }}
          />
        </View>
        <Button disabled={!request} onPress={handleLogin} className="w-full">
          <Text>Login or create account</Text>
        </Button>
        <View className="flex-col gap-2 w-full items-center">
          <View className="p-4 bg-light rounded-full">
            <Logo width={40} height={40} />
          </View>
          <Text className="text-sm text-subtext text-center">
            By continuing, you agree to our
            <Text
              onPress={() => Linking.openURL('https://a2apoint.com/terms')}
              className="text-sm text-info underline"
            >
              Terms of Service
            </Text>
            and that you have read our
            <Text
              onPress={() => Linking.openURL('https://a2apoint.com/privacy')}
              className="text-sm text-info underline"
            >
              Privacy Policy
            </Text>
          </Text>
        </View>
      </View>
    </View>
  );
}

export function LoginScreenHeader() {
  return (
    <Header>
      <View className="flex-row items-center gap-4">
        <BackButton />
        <HeaderTitle>Login</HeaderTitle>
      </View>
    </Header>
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
