import "~/global.css";
import "assets/dist/index.css"

import "react-native-gesture-handler";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Theme, ThemeProvider } from "@react-navigation/native";
import { SplashScreen, Stack } from "expo-router";
import * as React from "react";
import { Platform, Text, View } from "react-native";
import { useColorScheme } from "~/lib/useColorScheme";
import { PortalHost } from "~/components/primitives/portal";
import { LargeScreenProvider } from "~/context/large-screen";

export { ErrorBoundary } from "expo-router";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const { colorScheme, setColorScheme, colors } = useColorScheme();
  const [isColorSchemeLoaded, setIsColorSchemeLoaded] = React.useState(false);

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
      if (Platform.OS === "web") {
        // Adds the background color to the html element to prevent white background on overscroll.
        document.documentElement.classList.add("bg-background");
      }
      if (!theme) {
        AsyncStorage.setItem("theme", colorScheme);
        setIsColorSchemeLoaded(true);
        return;
      }
      const colorTheme = theme === "dark" ? "dark" : "light";
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

  if (!isColorSchemeLoaded) {
    return null;
  }

  return (
    <ThemeProvider value={theme}>
      <LargeScreenProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(screens)" />
          <Stack.Screen options={{ headerShown: true, headerTitle: "Login" }} name="login" />
        </Stack>
        <PortalHost />
      </LargeScreenProvider>
    </ThemeProvider>
  );
}
