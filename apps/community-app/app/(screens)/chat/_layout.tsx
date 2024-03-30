import { Stack } from "expo-router";
import { Drawer } from "expo-router/drawer";
import { Platform } from "react-native";

export default function ChatLayout() {
    return Platform.OS === "web" ? <Drawer>

    </Drawer> : <Stack screenOptions={{ headerBackButtonMenuEnabled: true }}>
        <Stack.Screen name="index" options={{ headerTitle: "Chat" }} />
        <Stack.Screen name="[roomId]" options={{ headerTitle: "" }} />
    </Stack>
}