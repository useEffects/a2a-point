import { MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { cx } from "class-variance-authority";
import { Tabs, router } from "expo-router";
import { Drawer } from "expo-router/drawer";
import { maybeCompleteAuthSession } from "expo-web-browser";
import React, { useContext, useEffect } from "react";
import { Image, Platform, View } from "react-native";
import BookMarkDual from "~/components/bottom-icons/bookmark/dual";
import BookMarkOutline from "~/components/bottom-icons/bookmark/outer";
import CardSearchDual from "~/components/bottom-icons/card-search/dual";
import CardSearchOutline from "~/components/bottom-icons/card-search/outer";
import ChatSquareDual from "~/components/bottom-icons/chat-square/dual";
import ChatSquareOutline from "~/components/bottom-icons/chat-square/outer";
import UsersGroupDual from "~/components/bottom-icons/users-group/dual";
import UsersGroupOutline from "~/components/bottom-icons/users-group/outer";
import { LargeScreenContext } from "~/context/large-screen";
import { buildAssetUrl } from "~/lib/helpers";
import { useColorScheme } from "~/lib/useColorScheme";
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
              drawerIcon: ({ focused }) => (
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
  const { colors } = useColorScheme()

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
          tabBarIcon: ({ focused, size }) => (
            focused ?
              <ChatSquareDual color={colors.primary} width={size} height={size} /> : <ChatSquareOutline color={colors.primary} width={size} height={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="community"
        options={{
          headerTitle: "Community",
          tabBarIcon: ({ focused, size }) => (
            focused ? <UsersGroupDual color={colors.primary} width={size} height={size} /> : <UsersGroupOutline color={colors.primary} width={size} height={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="index"
        options={{
          headerTitle: "Leads",
          tabBarIcon: ({ focused, size }) => (
            focused ? <CardSearchDual color={colors.primary} width={size} height={size} /> :
              <CardSearchOutline color={colors.primary} width={size} height={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="saved"
        options={{
          headerTitle: "Saved",
          tabBarIcon: ({ focused, size }) => (
            focused ? <BookMarkDual color={colors.primary} width={size} height={size} /> : <BookMarkOutline color={colors.primary} width={size} height={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          headerTitle: "Profile",
          tabBarIcon: ({ focused }) => (
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
