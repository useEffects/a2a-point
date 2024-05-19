import { cn } from "app/lib/utils";
import { MoonStar, Sun } from "lucide-react-native";
import { Pressable, View } from "react-native";

export function ToggleTheme({ onPress, isDark }: { onPress: () => void, isDark: boolean }) {
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
                    {isDark ? (
                        <MoonStar
                            className="text-foreground"
                            size={23}
                        />
                    ) : (
                        <Sun className="text-foreground" size={24} />
                    )}
                </View>
            )}
        </Pressable>
    );
}