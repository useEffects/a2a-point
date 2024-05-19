import AsyncStorage from "@react-native-async-storage/async-storage";
import { Theme, ThemeProvider, NavigationContainer, LinkingOptions, ParamListBase } from "@react-navigation/native";
import { PortalHost } from "app/components/primitives/portal";
import { useColorScheme } from "app/hooks/color-scheme";
import directusStore from "app/store/directus";
import { SplashScreen } from "expo-router";
import * as React from "react";
import { Platform } from "react-native";
import * as  Linking from "expo-linking"
import "react-native-gesture-handler";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import "tailwind-theme/theme.css";
import { ScreensLayout } from "./(screens)";
import GuestLayout from "./guest";

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

  console.log(Linking.createURL("/"))

  return (
    <ThemeProvider value={theme}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <NavigationContainer independent linking={linking}>
          {authenticated ? <ScreensLayout /> : <GuestLayout />}
        </NavigationContainer>
        <PortalHost />
      </GestureHandlerRootView>
    </ThemeProvider>
  );
}

const linking: LinkingOptions<any> = {
  prefixes: ["https://a2apoint.com", "a2apoint-community://", Linking.createURL("/")],
  config: {
    screens: {
      "(screens)": {
        screens: {
          "(screens)/index": "/",
          "(screens)/chat/index": "/chat",
          "(screens)/notifications": "/notifications",
          "(screens)/saved": "/saved",
          "(screens)/profile/index": "/profile",
        }
      }, "guest": {
        screens: {
          "guest": "/guest",
          "guest/listings": "/listings/:id"
        }
      }
    },
  },
}

export { ErrorBoundary } from "expo-router";