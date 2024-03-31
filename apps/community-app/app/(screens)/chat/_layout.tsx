import { Stack } from "expo-router";
import { Drawer } from "expo-router/drawer";
import { Platform, View } from "react-native";

export default function ChatLayout() {
  return Platform.OS === "web" ? (
    <Drawer
      screenOptions={{
        drawerType: "permanent",
        headerLeft: () => <View></View>,
      }}
    >
      <Drawer.Screen name="index" options={{ headerTitle: "Chat" }} />
      <Drawer.Screen name="[roomId]" options={{ headerTitle: "" }} />
    </Drawer>
  ) : (
    <Stack
      screenOptions={{
        headerBackVisible: false,
        animation: "slide_from_right",
      }}
    >
      <Stack.Screen name="index" options={{ headerTitle: "Chat" }} />
      <Stack.Screen name="[roomId]" options={{ headerTitle: "" }} />
    </Stack>
  );
}
