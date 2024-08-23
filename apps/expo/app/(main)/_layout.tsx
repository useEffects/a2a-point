import { BottomTabNavigationOptions } from "@react-navigation/bottom-tabs";
import { Construction, Home, Lock, MessageCircleMore, TrendingUp, User } from "app/components/icons";
import { Text } from "app/components/ui/text";
import { useColorScheme } from "app/hooks/color-scheme";
import directusStore from "app/store/directus";
import { Tabs } from 'expo-router';
import { LucideIcon } from "lucide-react-native";
import { Dimensions, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useKeyboard } from "../../hooks/keyboard";

export default function MainLayout() {
    const { width } = Dimensions.get("window");
    const { colors } = useColorScheme()
    const insets = useSafeAreaInsets()
    const { isKeyboardVisible } = useKeyboard()

    return (
        <Tabs
            backBehavior="history"
            tabBar={isKeyboardVisible ? () => null : undefined}
            screenOptions={{
                header: () => null,
                tabBarStyle: {
                    backgroundColor: colors.card,
                    borderTopColor: colors.border,
                    borderTopWidth: 1,
                    paddingBottom: insets.bottom,
                },
                tabBarItemStyle: {
                    width: width / 5,
                    paddingTop: 12,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-evenly",
                    alignItems: "center",
                },
            }}
            initialRouteName="(home)"
        >
            <Tabs.Screen name="chat" options={{ ...getTabItemsOptions("Chat", MessageCircleMore) }} />
            <Tabs.Screen name="offplans" options={{ ...getTabItemsOptions("Offplans", Construction) }} />
            <Tabs.Screen name="(home)" options={{ ...getTabItemsOptions("Home", Home) }} />
            <Tabs.Screen name="listings" options={{ ...getTabItemsOptions("Listings", TrendingUp) }} />
            <Tabs.Screen name="agents/me" options={{ ...getTabItemsOptions("Profile", User) }} />
        </Tabs>
    );
}

const getTabItemsOptions = (label: string, Icon: LucideIcon): BottomTabNavigationOptions => {
    return {
        tabBarIcon: ({ focused }) => {
            const { authenticated } = directusStore()
            const { colors } = useColorScheme()
            const navigable = authenticated || navigableTabs.includes(label)
            const activeColor = focused ? (navigable ? colors.primary : colors.subtext) : colors["card-foreground"]
            const fillColor = focused ? (navigable ? colors.primary : colors.subtext) : "transparent"

            return <View style={{
                paddingHorizontal: 16,
                paddingVertical: 4,
                justifyContent: "center",
                alignItems: "center",
            }}>
                {navigable ? <></> : <Lock
                    color={activeColor}
                    size={10}
                    style={{
                        position: "absolute",
                        top: 0,
                        right: "auto",
                        left: 0
                    }}
                />
                }
                <Icon color={activeColor} fill={fillColor} size={20} />
            </View>
        },
        tabBarLabel: ({ focused }) => {
            const { authenticated } = directusStore()
            const { colors } = useColorScheme()
            const navigable = authenticated || navigableTabs.includes(label)
            const activeColor = focused ? (navigable ? colors.primary : colors.subtext) : colors["card-foreground"]

            return <Text style={{ color: activeColor }}>
                {label}
            </Text>
        }
    }
}

const navigableTabs = ["Home", "Listings"]