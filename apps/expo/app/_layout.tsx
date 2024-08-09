import { Stack } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Theme, ThemeProvider } from "@react-navigation/native";
import { useColorScheme } from "app/hooks/color-scheme";
import directusStore, { reqNewTokens, shouldRefresh } from "app/store/directus";
import { SplashScreen } from "expo-router";
import * as React from "react";
import { Platform } from "react-native";
import "react-native-gesture-handler";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import "tailwind-theme/theme.css";
import { Providers } from "app/components/providers";
import * as navigationBar from "expo-navigation-bar"

export default function RootLayoutNav() {
    const { colorScheme, setColorScheme, colors } = useColorScheme();
    const [isColorSchemeLoaded, setIsColorSchemeLoaded] = React.useState(false);
    const { initialize } = directusStore();
    const [ready, setReady] = React.useState({
        directus: false,
        colorScheme: false,
    });

    const shouldRefreshToken = React.useCallback(async () => {
        const accessToken = await AsyncStorage.getItem("accessToken");
        return await shouldRefresh(accessToken);
    }, []);

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

    const initializeDirectus = React.useCallback(async () => {
        if (ready.directus) return;
        const refreshToken = await AsyncStorage.getItem("refreshToken");
        const accessToken = await AsyncStorage.getItem("accessToken");
        if (refreshToken && accessToken) {
            const tokens = { refreshToken, accessToken };
            if (await shouldRefreshToken()) {
                const newTokens = await reqNewTokens(refreshToken);
                if (newTokens) {
                    tokens.accessToken = newTokens.accessToken;
                    tokens.refreshToken = newTokens.refreshToken;
                }
            }
            console.log("rendering!");
            await initialize(tokens.accessToken, tokens.refreshToken);
        }
        setReady(p => ({ ...p, directus: true }));
    }, [ready.directus]);

    const initializeApp = React.useCallback(async () => {
        if (ready.colorScheme) return;
        const theme = await AsyncStorage.getItem("theme");
        if (!theme) {
            await AsyncStorage.setItem("theme", colorScheme);
        } else {
            setColorScheme(theme === "dark" ? "dark" : "light");
        }
        setIsColorSchemeLoaded(true);
        if (Platform.OS === "web") {
            document.documentElement.classList.add("bg-background");
        }
        setReady(p => ({ ...p, colorScheme: true }));
    }, [ready.colorScheme]);

    React.useEffect(() => {
        const initialize = async () => {
            await initializeDirectus();
            await initializeApp();
            navigationBar.setBackgroundColorAsync(colors.card);
            setTimeout(() => SplashScreen.hideAsync(), 3000);
        };
        initialize();
    }, [initializeDirectus, initializeApp]);

    if (!isColorSchemeLoaded || !ready.directus) {
        return null;
    }

    return (
        <ThemeProvider value={theme}>
            <GestureHandlerRootView style={{ flex: 1 }}>
                <Providers>
                    <Stack screenOptions={{ headerShown: false }}>
                        <Stack.Screen name="(main)" />
                        <Stack.Screen name="account-console" />
                        <Stack.Screen name="login" />
                        <Stack.Screen name="locations" />
                        <Stack.Screen name="agents" />
                        <Stack.Screen name="listings" />
                    </Stack>
                </Providers>
            </GestureHandlerRootView>
        </ThemeProvider>

    );
}