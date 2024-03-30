import '~/global.css';

import 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MaterialIcons } from '@expo/vector-icons';
import { Theme, ThemeProvider } from '@react-navigation/native';
import { SplashScreen } from 'expo-router';
import * as React from 'react';
import { Image, Platform, View } from 'react-native';
import { NAV_THEME, directusUrl } from '~/lib/constants';
import { useColorScheme } from '~/lib/useColorScheme';
import { PortalHost } from '~/components/primitives/portal';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createDrawerNavigator } from '@react-navigation/drawer';
import Listings from './index';
import Discover from './saved';
import Chat from './chat';
import Community from './community';
import Settings from './settings';
import Saved from './saved';
import { UserContext, UserProvider } from '~/context/user';
import { AuthContext, AuthProvider } from '~/context/auth';
import { cx } from 'class-variance-authority';

const Tabs = createBottomTabNavigator();
const Drawer = createDrawerNavigator();

const LIGHT_THEME: Theme = {
  dark: false,
  colors: NAV_THEME.light,
};
const DARK_THEME: Theme = {
  dark: true,
  colors: NAV_THEME.dark,
};

export {
  ErrorBoundary,
} from 'expo-router';

SplashScreen.preventAutoHideAsync();

const WebNavigation = () => {
  const userData = React.useContext(UserContext)
  const authData = React.useContext(AuthContext)

  return (
    <View className='w-full h-full flex items-center min-h-screen'>
      <View className='container h-full'>
        <Drawer.Navigator initialRouteName="index" screenOptions={{ drawerType: "permanent", headerShown: false }}>
          <Drawer.Screen
            name="chat"
            component={Chat}
            options={{
              title: "Chat",
              drawerIcon: ({ color, size }) => <MaterialIcons name="chat" size={size} color={color} />,
            }}
          />
          <Drawer.Screen
            name="community"
            component={Community}
            options={{
              title: "Community",
              drawerIcon: ({ color, size }) => <MaterialIcons name="groups" size={size} color={color} />,
            }}
          />
          <Drawer.Screen
            name="index"
            component={Listings}
            options={{
              title: "Explore",
              drawerIcon: ({ color, size }) => <MaterialIcons name="explore" size={size} color={color} />,
            }}
          />
          <Drawer.Screen
            name="saved"
            component={Saved}
            options={{
              title: "Saved",
              drawerIcon: ({ color, size }) => <MaterialIcons name="bookmark" size={size} color={color} />,
            }}
          />
          <Drawer.Screen
            name="settings"
            component={Settings}
            options={{
              title: "Profile",
              drawerIcon: ({ color, focused, size }) => (
                <Image className={cx('w-8 h-8 rounded-full border-solid border-[1px]', focused ? "border-primary" : "border-secondary")} source={{ uri: `${directusUrl}/assets/${userData?.avatar}?access_token=${authData?.access_token}` }} />
              ),
            }}
          />
        </Drawer.Navigator>
      </View>
    </View>
  );
};

const MobileNavigation = () => {
  const userData = React.useContext(UserContext)
  const authData = React.useContext(AuthContext)
  return (
    <Tabs.Navigator initialRouteName='index' screenOptions={{ tabBarLabelStyle: { display: 'none' } }}>
      <Tabs.Screen
        name="chat"
        component={Chat}
        options={{
          headerTitle: "Chat",
          tabBarIcon: ({ color, focused, size }) => (
            <MaterialIcons name="chat" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="community"
        component={Community}
        options={{
          headerTitle: "Community",
          tabBarIcon: ({ color, focused, size }) => (
            <MaterialIcons name="groups" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="index"
        component={Listings}
        options={{
          headerTitle: "Explore",
          tabBarIcon: ({ color, focused, size }) => (
            <MaterialIcons name="explore" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="saved"
        component={Saved}
        options={{
          headerTitle: "Saved",
          tabBarIcon: ({ color, focused, size }) => (
            <MaterialIcons name="bookmark" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        component={Settings}
        options={{
          headerTitle: "Profile",
          tabBarIcon: ({ color, focused, size }) => (
            <Image className={cx('w-8 h-8 rounded-full border-solid border-[1px]', focused ? "border-primary" : "border-secondary")} source={{ uri: `${directusUrl}/assets/${userData?.avatar}?access_token=${authData?.access_token}` }} />
          ),
        }}
      />
    </Tabs.Navigator>
  );
};

export default function RootLayout() {
  const { colorScheme, setColorScheme, isDarkColorScheme } = useColorScheme();
  const [isLargeScreen, setIsLargeScreen] = React.useState(false);
  const [isColorSchemeLoaded, setIsColorSchemeLoaded] = React.useState(false);

  React.useEffect(() => {
    (async () => {
      const theme = await AsyncStorage.getItem('theme');
      if (Platform.OS === 'web') {
        // Adds the background color to the html element to prevent white background on overscroll.
        document.documentElement.classList.add('bg-background');
      }
      if (!theme) {
        AsyncStorage.setItem('theme', colorScheme);
        setIsColorSchemeLoaded(true);
        return;
      }
      const colorTheme = theme === 'dark' ? 'dark' : 'light';
      if (colorTheme !== colorScheme) {
        setColorScheme(colorTheme);

        setIsColorSchemeLoaded(true);
        return;
      }
      setIsColorSchemeLoaded(true);
    })().finally(() => {
      SplashScreen.hideAsync();
    });
  }, []);
  React.useEffect(() => {
    if (Platform.OS !== "web") return
    const handleResize = () => setIsLargeScreen(window.innerWidth >= 640);
    handleResize()
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [Platform]);

  if (!isColorSchemeLoaded) {
    return null;
  }

  return (
    <AuthProvider>
      <UserProvider>
        <ThemeProvider value={isDarkColorScheme ? DARK_THEME : LIGHT_THEME}>
          {isLargeScreen ? <WebNavigation /> : <MobileNavigation />}
          <PortalHost />
        </ThemeProvider>
      </UserProvider>
    </AuthProvider>
  );
}
