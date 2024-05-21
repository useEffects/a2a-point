import AsyncStorage from "@react-native-async-storage/async-storage";
import { useColorScheme } from "app/hooks/color-scheme";
import { cn } from "app/lib/utils";
import { MoonStar, Sun } from "lucide-react-native";
import { Platform, Pressable, View } from "react-native";
import * as NavigationBar from 'expo-navigation-bar';
import { theme as palette } from "tailwind-theme/src/colors"

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
        <Pressable
            onPress={onPress}
            className="web:ring-offset-background web:transition-colors web:focus-visible:outline-none web:focus-visible:ring-2 web:focus-visible:ring-ring web:focus-visible:ring-offset-2">
            {({ pressed }) => (
                <View
                    className={cn(
                        "aspect-square pt-0.5 justify-center items-start web:px-5",
                        pressed && "opacity-70",
                    )}>
                    {isDarkColorScheme ? (
                        <MoonStar color={colors.foreground} size={18} />
                    ) : (
                        <Sun color={colors.foreground} size={18} />
                    )}
                </View>
            )}
        </Pressable>
    );
}