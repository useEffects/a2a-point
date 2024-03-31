import { MaterialIcons } from "@expo/vector-icons";
import { cx } from "class-variance-authority";
import { Tabs } from "expo-router";
import { Drawer } from "expo-router/drawer";
import React from "react";
import { Image, Platform, View } from "react-native";
import { Text } from "~/components/ui/text";
import { AuthContext } from "~/context/auth";
import { UserContext } from "~/context/user";
import { directusUrl } from "~/lib/constants";

const WebNavigation = () => {
  const userData = React.useContext(UserContext);
  const authData = React.useContext(AuthContext);

  return (
    <View className="w-full h-full flex items-center min-h-screen">
      <View className="container h-full">
        <Drawer
          initialRouteName="index"
          screenOptions={{
            drawerType: "permanent",
            drawerLabelStyle: { display: "none" },
            drawerItemStyle: { width: 40 },
            drawerStyle: { width: 64 },
            headerLeft: () => <View> </View>,
          }}
        >
          <Drawer.Screen
            name="chat"
            options={{
              title: "Chat",
              drawerIcon: ({ color, size }) => (
                <MaterialIcons name="chat" size={size} color={color} />
              ),
            }}
          />
          <Drawer.Screen
            name="community"
            options={{
              title: "Community",
              drawerIcon: ({ color, size }) => (
                <MaterialIcons name="groups" size={size} color={color} />
              ),
            }}
          />
          <Drawer.Screen
            name="index"
            options={{
              title: "Explore",
              drawerIcon: ({ color, size }) => (
                <MaterialIcons name="explore" size={size} color={color} />
              ),
            }}
          />
          <Drawer.Screen
            name="saved"
            options={{
              title: "Saved",
              drawerIcon: ({ color, size }) => (
                <MaterialIcons name="bookmark" size={size} color={color} />
              ),
            }}
          />
          <Drawer.Screen
            name="settings"
            options={{
              title: "Profile",
              drawerIcon: ({ color, focused, size }) => (
                <Image
                  className={cx(
                    "w-6 h-6 m-auto rounded-full border-solid border-[1px]",
                    focused ? "border-primary" : "border-secondary"
                  )}
                  source={{
                    uri: `${directusUrl}/assets/${userData?.avatar}?access_token=${authData?.access_token}`,
                  }}
                />
              ),
            }}
          />
        </Drawer>
      </View>
    </View>
  );
};

const MobileNavigation = () => {
  const userData = React.useContext(UserContext);
  const authData = React.useContext(AuthContext);
  return (
    <Tabs
      initialRouteName="index"
      screenOptions={{
        tabBarLabelStyle: { display: "none" },
        headerTitle: "",
      }}
    >
      <Tabs.Screen
        name="chat"
        options={{
          headerShown: false,
          tabBarIcon: ({ color, focused, size }) => (
            <MaterialIcons name="chat" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="community"
        options={{
          headerTitle: "Community",
          tabBarIcon: ({ color, focused, size }) => (
            <MaterialIcons name="groups" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="index"
        options={{
          headerTitle: "Leads",
          tabBarIcon: ({ color, focused, size }) => (
            <MaterialIcons name="explore" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="saved"
        options={{
          headerTitle: "Saved",
          tabBarIcon: ({ color, focused, size }) => (
            <MaterialIcons name="bookmark" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          headerTitle: "Profile",
          tabBarIcon: ({ color, focused, size }) => (
            <Image
              className={cx(
                "w-8 h-8 rounded-full border-solid border-[1px]",
                focused ? "border-primary" : "border-secondary"
              )}
              source={{
                uri: `${directusUrl}/assets/${userData?.avatar}?access_token=${authData?.access_token}`,
              }}
            />
          ),
        }}
      />
    </Tabs>
  );
};

export default function Layout() {
  const [isLargeScreen, setIsLargeScreen] = React.useState(false);

  React.useEffect(() => {
    if (Platform.OS !== "web") {
      return;
    }
    const handleResize = () => setIsLargeScreen(window.innerWidth >= 640);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [Platform]);

  return isLargeScreen ? <WebNavigation /> : <MobileNavigation />;
}
