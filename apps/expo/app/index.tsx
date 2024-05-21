import AsyncStorage from "@react-native-async-storage/async-storage";
import { Theme, ThemeProvider } from "@react-navigation/native";
import { PortalHost } from "app/components/primitives/portal";
import { useColorScheme } from "app/hooks/color-scheme";
import directusStore from "app/store/directus";
import { SplashScreen } from "expo-router";
import * as React from "react";
import { Platform, StatusBar } from "react-native";
import "react-native-gesture-handler";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import "tailwind-theme/theme.css";
import AppLayout from "./screens";
import { setAndroidNavigationBarTheme } from "app/components/toggle-theme";
import ChatsProvider from "app/components/providers/chats";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const { colorScheme, setColorScheme, colors } = useColorScheme();
  const [isColorSchemeLoaded, setIsColorSchemeLoaded] = React.useState(false);
  const { authenticated } = directusStore()

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
    (async () => {
      const theme = await AsyncStorage.getItem("theme");
      if (!theme) {
        await AsyncStorage.setItem("theme", colorScheme);
      } else {
        setAndroidNavigationBarTheme(theme === "dark" ? "dark" : "light");
        setColorScheme(theme === "dark" ? "dark" : "light");
      }
      setIsColorSchemeLoaded(true)
      if (Platform.OS === "web") {
        // Adds the background color to the html element to prevent white background on overscroll.
        document.documentElement.classList.add("bg-background");
      }
    })().finally(() => {
      if (isColorSchemeLoaded) {
        SplashScreen.hideAsync();
      }
    });
  }, [isColorSchemeLoaded, colorScheme, setColorScheme]);

  if (!isColorSchemeLoaded) {
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