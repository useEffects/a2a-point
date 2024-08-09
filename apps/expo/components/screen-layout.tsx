import { useColorScheme } from "app/hooks/color-scheme";
import { Stack } from "expo-router";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function ScreenLayout({ names }: { names: string[] }) {
    const { colors } = useColorScheme()
    const insets = useSafeAreaInsets()

    return (
        <Stack
            screenOptions={{
                header: () => <View style={{
                    backgroundColor: colors.card,
                    height: insets.top
                }} />
            }}
            initialRouteName={names[0]}
        >
            {names.map((name, key) => <Stack.Screen key={key} name={name} />)}
        </Stack>
    );
}