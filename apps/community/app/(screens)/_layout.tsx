import { MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Tabs, router } from "expo-router";
import { Drawer } from "expo-router/drawer";
import { maybeCompleteAuthSession } from "expo-web-browser";
import React, { useContext } from "react";
import { View, Image, Platform } from "react-native";
import { ThemeToggle } from "~/components/ThemeToggle";
import { LargeScreenContext } from "~/context/large-screen";
import { buildAssetUrl } from "~/lib/helpers";
import { useColorScheme } from "~/lib/useColorScheme";
import { cn } from "~/lib/utils";
import directusStore from "~/store/directus";
import userStore from "~/store/user";

interface NavigationItem {
    name: string;
    title: string;
    icon: (color: string, size: number) => JSX.Element;
}

const _disabledNavigationItems: string[] = []

const _navigationItem: NavigationItem[] = [
    {
        name: "chat",
        title: "Chat",
        icon: (color, size) => (
            <MaterialIcons name="chat" size={size} color={color} />
        ),
    },
    {
        name: "community",
        title: "Community",
        icon: (color, size) => (
            <MaterialIcons name="groups" size={size} color={color} />
        ),
    },
    {
        name: "(home)",
        title: "Home",
        icon: (color, size) => (
            <MaterialIcons name="explore" size={size} color={color} />
        ),
    },
    {
        name: "saved",
        title: "Saved",
        icon: (color, size) => (
            <MaterialIcons name="bookmark" size={size} color={color} />
        ),
    }
];

const WebNavigation = () => {
    const { user } = userStore();

    return (

        <Drawer
            screenOptions={{
                drawerType: "permanent",
                headerLeft: () => <View />,
                headerShown: false,
            }}
        >
            {_navigationItem.map((navItem) => (
                <Drawer.Screen
                    key={navItem.name}
                    name={navItem.name}
                    options={{
                        title: navItem.title,
                        drawerIcon: ({ color, size }) => navItem.icon(color, size),
                    }}
                />
            ))}
            <Drawer.Screen key={_navigationItem.length} name="profile" options={{
                title: "Profile",
                drawerIcon: ({ focused }) => (
                    <Image
                        className={cn(
                            "w-6 h-6 m-auto rounded-full border-solid border-[1px]",
                            focused ? "border-primary" : "border-secondary",
                        )}
                        source={{
                            uri: buildAssetUrl(user?.avatar),
                        }}
                    />
                ),
            }} />
        </Drawer>
    );
};

const MobileNavigation = () => {
    const { user } = userStore();
    const { colors } = useColorScheme();
    const navigationItems: React.JSX.Element[] = [];

    _navigationItem.forEach((navItem) => {
        navigationItems.push(
            <Tabs.Screen
                key={navItem.name}
                name={navItem.name}
                options={{
                    headerShown: !["chat", "(home)", "profile"].includes(navItem.name),
                    headerTitle: navItem.title,
                    tabBarIcon: ({ focused, size }) =>
                        navItem.icon(
                            focused ? colors.primary : colors.secondary,
                            size
                        ),
                }}
            />
        );
    });

    navigationItems.push(
        <Tabs.Screen key={_navigationItem.length} name="profile" options={{
            headerShown: false,
            headerTitle: "Profile",
            headerRight: () => <ThemeToggle />,
            tabBarIcon: ({ focused }) => (
                <Image
                    className={cn(
                        "w-6 h-6 m-auto rounded-full border-solid border-[1px]",
                        focused ? "border-primary" : "border-secondary",
                    )}
                    source={{
                        uri: buildAssetUrl(user?.avatar),
                    }}
                />
            ),
        }} />
    );

    _disabledNavigationItems.forEach((navItem, i) => {
        navigationItems.push(
            <Tabs.Screen
                key={i + _navigationItem.length}
                name={navItem}
                options={{
                    href: null
                }}
            />
        );
    })

    return (
        <Tabs
            initialRouteName="(home)"
            screenOptions={{
                tabBarLabelStyle: { display: "none" },
                headerTitle: "",
            }}
        >
            {navigationItems}
        </Tabs>
    );
};

export default function Layout() {
    const { rest, initialize } = directusStore();
    const isLargeScreen = useContext(LargeScreenContext);
    const [isReady, setIsReady] = React.useState(false);

    React.useEffect(() => {
        if (Platform.OS === "web") {
            maybeCompleteAuthSession();
        }
    }, [Platform]);

    React.useEffect(() => {
        (async () => {
            const accessToken = await rest.getToken();
            if (!accessToken) {
                const accessToken = await AsyncStorage.getItem("accessToken");
                if (!accessToken) {
                    router.replace("/login");
                } else {
                    await initialize(accessToken);
                }
            }
            setIsReady(true);
        })();
    }, [rest]);

    return isReady ? (
        isLargeScreen ? <WebNavigation /> : <MobileNavigation />
    ) : (
        <View />
    );
}
