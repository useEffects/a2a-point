import AsyncStorage from "@react-native-async-storage/async-storage";
import { Theme, ThemeProvider } from "@react-navigation/native";
import { PortalHost } from "app/components/primitives/portal";
import ChatsProvider from "app/components/providers/chats";
import { setAndroidNavigationBarTheme } from "app/components/toggle-theme";
import { useColorScheme } from "app/hooks/color-scheme";
import directusStore, { reqNewTokens } from "app/store/directus";
import { SplashScreen } from "expo-router";
import * as React from "react";
import { Platform, StatusBar } from "react-native";
import "react-native-gesture-handler";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import "tailwind-theme/theme.css";
import AppLayout from "../screens";
import {
  useFonts,
  OpenSans_300Light,
  OpenSans_400Regular,
  OpenSans_500Medium,
  OpenSans_600SemiBold,
  OpenSans_700Bold,
  OpenSans_800ExtraBold,
  OpenSans_300Light_Italic,
  OpenSans_400Regular_Italic,
  OpenSans_500Medium_Italic,
  OpenSans_600SemiBold_Italic,
  OpenSans_700Bold_Italic,
  OpenSans_800ExtraBold_Italic,
} from '@expo-google-fonts/open-sans';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const { colorScheme, setColorScheme, colors } = useColorScheme();
  const [isColorSchemeLoaded, setIsColorSchemeLoaded] = React.useState(false);
  const { initialize, authenticated } = directusStore()
  const [fontsLoaded] = useFonts({
    OpenSans_300Light,
    OpenSans_400Regular,
    OpenSans_500Medium,
    OpenSans_600SemiBold,
    OpenSans_700Bold,
    OpenSans_800ExtraBold,
    OpenSans_300Light_Italic,
    OpenSans_400Regular_Italic,
    OpenSans_500Medium_Italic,
    OpenSans_600SemiBold_Italic,
    OpenSans_700Bold_Italic,
    OpenSans_800ExtraBold_Italic,
  });
  const [ready, setReady] = React.useState({
    directus: false,
    colorScheme: false,
    fonts: false
  })

  const theme: Theme = {
    dark: colorScheme === "dark",
    colors: {
      background: colors.background,
      border: colors.border,
      card: colors.card,
      notification: colors.accent,
      primary: colors.primary,
      text: colors.foreground
    },
  };

  React.useEffect(() => {
    async function initializeDirectus() {
      if (ready.directus) return
      const refreshToken = await AsyncStorage.getItem("refreshToken");
      if (refreshToken) {
        const newTokens = await reqNewTokens(refreshToken)
        if (newTokens) {
          await initialize(newTokens.accessToken, newTokens.refreshToken)
        }
      }
      setReady(p => ({ ...p, directus: true }))
    }
    async function initializeApp() {
      if (ready.colorScheme) return
      const theme = await AsyncStorage.getItem("theme");
      if (!theme) {
        await AsyncStorage.setItem("theme", colorScheme);
      } else {
        setAndroidNavigationBarTheme(theme === "dark" ? "dark" : "light");
        setColorScheme(theme === "dark" ? "dark" : "light");
      }
      setIsColorSchemeLoaded(true)
      if (Platform.OS === "web") {
        document.documentElement.classList.add("bg-background");
      }
      setReady(p => ({ ...p, colorScheme: true }))
    }
    async function initializeFonts() {
      if (ready.fonts) return
      if (fontsLoaded) {
        setReady(p => ({ ...p, fonts: true }))
      }
    }

    const promises = Promise.all([initializeDirectus(), initializeApp(), initializeFonts()])
    promises.then(() => SplashScreen.hideAsync())

  }, [ready, colorScheme, colors, fontsLoaded, initialize, setColorScheme, authenticated]);

  if (!isColorSchemeLoaded || !ready.directus || !ready.fonts) {
    return null
  }

  return (
    <ThemeProvider value={theme}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <StatusBar barStyle={colorScheme === "light" ? "dark-content" : "light-content"} backgroundColor={colors.card} />
        <ChatsProvider>
          <AppLayout />
        </ChatsProvider>
        <PortalHost />
      </GestureHandlerRootView>
    </ThemeProvider>
  );
}

export { ErrorBoundary } from "expo-router";
