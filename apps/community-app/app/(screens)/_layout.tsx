import { MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { cx } from "class-variance-authority";
import { Tabs, router } from "expo-router";
import { Drawer } from "expo-router/drawer";
import { maybeCompleteAuthSession } from "expo-web-browser";
import React, { useContext, useEffect } from "react";
import { Image, Platform, View } from "react-native";
import { LargeScreenContext } from "~/context/large-screen";
import { buildAssetUrl } from "~/lib/helpers";
import directusStore from "~/store/directus";
import userStore from "~/store/user";

const WebNavigation = () => {
  const { user } = userStore()

  return (
    <View className="w-full h-full flex items-center min-h-screen">
      <View className="container h-full">
        <Drawer
          screenOptions={{
            drawerType: "permanent",
            drawerLabelStyle: { display: "none" },
            drawerItemStyle: { width: 40 },
            drawerStyle: { width: 64 },
            headerLeft: () => <View> </View>,
          }}>
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
                    focused ? "border-primary" : "border-secondary",
                  )}
                  source={{
                    uri: buildAssetUrl(user?.avatar),
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
  const { user } = userStore()

  return (
    <Tabs
      initialRouteName="index"
      screenOptions={{
        tabBarLabelStyle: { display: "none" },
        headerTitle: "",
      }}>
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
                focused ? "border-primary" : "border-secondary",
              )}
              source={{
                uri: buildAssetUrl(user?.avatar),
              }}
            />
          ),
        }}
      />
    </Tabs>
  );
};


export default function Layout() {

  const { rest, initialize } = directusStore()
  const isLargeScreen = useContext(LargeScreenContext)
  const [isReady, setIsReady] = React.useState(false)

  React.useEffect(() => {
    if (Platform.OS === "web") {
      maybeCompleteAuthSession()
    };
  }, [Platform]);

  React.useEffect(() => {
    (async () => {
      const accessToken = await rest.getToken()
      if (!accessToken) {
        const accessToken = await AsyncStorage.getItem("accessToken")
        if (!accessToken) {
          router.replace("/login")
        } else {
          await initialize(accessToken)
        }
      }
      setIsReady(true)
    })()
  }, [rest])

  return isReady ? (isLargeScreen ? <WebNavigation /> : <MobileNavigation />) : (<View />)
}
