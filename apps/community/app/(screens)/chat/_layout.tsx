import { Stack } from "expo-router";
import { Drawer } from "expo-router/drawer";
import { View } from "react-native";
import { ChatList } from ".";
import { useContext } from "react";
import { LargeScreenContext } from "~/context/large-screen";

export default function ChatLayout() {
  const isLargeScreen = useContext(LargeScreenContext)
  return isLargeScreen ? (
    <Drawer
      drawerContent={() => (
        <View className="mx-4 my-2">
          <ChatList />
        </View>
      )}
      screenOptions={{
        drawerType: "permanent",
        headerLeft: () => <View />,
      }}>
      <Drawer.Screen name="index" options={{ headerShown: isLargeScreen ? false : undefined, headerTitle: "Chat" }} />
      <Drawer.Screen name="[roomId]" options={{ headerTitle: "" }} />
    </Drawer>
  ) : (
    <Stack
      screenOptions={{
        headerBackVisible: false,
        animation: "slide_from_right",
      }}>
      <Stack.Screen name="index" options={{ headerTitle: "Chat" }} />
      <Stack.Screen name="[roomId]" options={{ headerTitle: "", headerBackButtonMenuEnabled: true }} />
    </Stack>
  );
}