import AsyncStorage from "@react-native-async-storage/async-storage";
import { useColorScheme } from "app/hooks/color-scheme";
import { cn } from "app/lib/utils";
import { MoonStar, Sun } from "lucide-react-native";
import { Platform, Pressable, View } from "react-native";
import * as NavigationBar from 'expo-navigation-bar';
import { theme as palette } from "tailwind-theme/src/colors"
import { Button } from "./ui/button";

export async function setAndroidNavigationBarTheme(theme: 'light' | 'dark') {
    if (Platform.OS !== 'android') {
        return;
    }
    await NavigationBar.setButtonStyleAsync(theme === 'dark' ? 'light' : 'dark');
    await NavigationBar.setBackgroundColorAsync(palette[theme].card);
}

export function ToggleTheme() {
    const { colors, isDarkColorScheme, toggleColorScheme, setColorScheme } = useColorScheme()

    const nativeOnPress = () => {
        const newTheme = isDarkColorScheme ? "light" : "dark";
        setColorScheme(newTheme);
        setAndroidNavigationBarTheme(newTheme);
        AsyncStorage.setItem("theme", newTheme);
    }

    const onPress = Platform.OS !== "web" ? nativeOnPress : toggleColorScheme

    return (
        <Button variant="ghost" size={"icon"}
            onPress={onPress}
            className="web:ring-offset-background web:transition-colors web:focus-visible:outline-none web:focus-visible:ring-2 web:focus-visible:ring-ring web:focus-visible:ring-offset-2">
            {isDarkColorScheme ? <MoonStar color={colors.foreground} size={24} />
                : <Sun color={colors.foreground} size={24} />
            }
        </Button>
    );
}