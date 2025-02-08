import LoginDarkImg from 'app/assets/login/dark/Frame_135_2_hzjyas_c_scale,w_1085.jpg';
import LoginLightImg from 'app/assets/login/light/light_c9pqo8_c_scale,w_1029.jpg';
import { AsyncImage } from 'app/components/async-image';
import { Header } from 'app/components/header';
import Logo from 'app/components/svg/logo';
import { Button } from 'app/components/ui/button';
import { Text } from 'app/components/ui/text';
import { ScrollView } from 'app/components/utils/virtual-lists';
import { useColorScheme } from 'app/hooks/color-scheme';
import { useRouter } from 'app/hooks/router';
import { directusUrl, portfolioUrl } from 'app/lib/constants';
import { directusStore } from 'app/store/directus';
import * as Linking from 'expo-linking';
import * as WebBrowser from 'expo-web-browser';
import { useEffect } from 'react';
import { View } from 'react-native';
import { parse } from 'search-params';

const LoginScreen = () => {
  const { authenticated } = directusStore();
  const router = useRouter();
  const appURL = 'a2apoint-community://';
  const { isDarkColorScheme } = useColorScheme();

  useEffect(() => {
    const timer = setInterval(() => {
      if (authenticated) {
        router.replace('/');
        clearInterval(timer);
      }
    }, 100);
    return () => clearInterval(timer);
  }, [authenticated]);

  const handleLogin = async () => {
    try {
      const result = await WebBrowser.openAuthSessionAsync(
        `${directusUrl}/auth/login/keycloak?redirect=${portfolioUrl}/api/auth-redirect?appUrl=${appURL}/login`,
        appURL,
      );
      console.log(result);
      if (result.type === 'success') {
        const { access_token: accessToken, refresh_token: refreshToken } =
          parse(result.url);
        if (accessToken && refreshToken) {
          //   await initialize(accessToken.toString(), refreshToken.toString());
          router.replace('/');
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View className="flex-1">
      <Header>
        <Text className="text-xl font-bold">Login</Text>
      </Header>
      <View className="flex-col justify-between flex-1 items-start px-4 py-8 bg-primary">
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
          <AsyncImage
            source={isDarkColorScheme ? LoginDarkImg : LoginLightImg}
            style={{ width: 350, height: 350 }}
          />
        </View>
        <Button onPress={handleLogin} className="w-full">
          <Text>Login or create account</Text>
        </Button>
        <View className="flex-col gap-2 w-full items-center">
          <View className="p-4 bg-light rounded-full">
            <Logo width={40} height={40} />
          </View>
          <Text className="text-sm text-subtext text-center">
            By continuing, you agree to our{' '}
            <Button
              onPress={() => Linking.openURL('https://a2apoint.com')}
              size={'none'}
              variant={'base'}
            >
              <Text className="text-sm text-info underline">
                Terms of Service
              </Text>
            </Button>
            and that you have read our
            <Button
              onPress={() => Linking.openURL('https://a2apoint.com')}
              size={'none'}
              variant={'base'}
            >
              <Text className="text-sm text-info underline">
                Privacy Policy
              </Text>
            </Button>
          </Text>
        </View>
      </View>
    </View>
  );
};

export default LoginScreen;
