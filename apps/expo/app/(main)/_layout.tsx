import {
    MaterialTopTabNavigationEventMap,
    MaterialTopTabNavigationOptions,
    createMaterialTopTabNavigator,
} from "@react-navigation/material-top-tabs";
import { withLayoutContext } from "expo-router";
import { ParamListBase, TabNavigationState } from "@react-navigation/native";
import { Dimensions, View } from "react-native";
import { Construction, Home, Lock, MessageCircleMore, TrendingUp, User } from "app/components/icons";
import { LucideIcon } from "lucide-react-native";
import { Text } from "app/components/ui/text";
import { useColorScheme } from "app/hooks/color-scheme";
import opacity from "hex-color-opacity";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import directusStore from "app/store/directus";

const { Navigator } = createMaterialTopTabNavigator();

export const MaterialTopTabs = withLayoutContext<
    MaterialTopTabNavigationOptions,
    typeof Navigator,
    TabNavigationState<ParamListBase>,
    MaterialTopTabNavigationEventMap
>(Navigator);

export default function MainLayout() {
    const { width } = Dimensions.get("window");
    const { colors } = useColorScheme()
    const insets = useSafeAreaInsets()

    return (
        <MaterialTopTabs
            tabBarPosition="bottom"
            screenOptions={{
                tabBarContentContainerStyle: {
                    flexDirection: "row",
                    justifyContent: "space-between",
                },
                tabBarStyle: {
                    backgroundColor: colors.card,
                    borderTopColor: colors.border,
                    borderTopWidth: 1,
                    paddingBottom: insets.bottom
                },
                tabBarItemStyle: {
                    width: width / 5,
                },
                tabBarIndicatorStyle: {
                    height: 0,
                },
                tabBarAndroidRipple: {
                    color: "transparent",
                },
                tabBarLabel: "",
            }}
            initialRouteName="(home)"
        >
            <MaterialTopTabs.Screen name="chat" options={{ ...getTabItemsOptions("Chat", MessageCircleMore) }} />
            <MaterialTopTabs.Screen name="offplans" options={{ ...getTabItemsOptions("Offplans", Construction) }} />
            <MaterialTopTabs.Screen name="(home)" options={{ ...getTabItemsOptions("Home", Home) }} />
            <MaterialTopTabs.Screen name="listings" options={{ ...getTabItemsOptions("Listings", TrendingUp) }} />
            <MaterialTopTabs.Screen name="agents" options={{ ...getTabItemsOptions("Profile", User) }} />
        </MaterialTopTabs>
    );
}

const getTabItemsOptions = (label: string, Icon: LucideIcon): MaterialTopTabNavigationOptions => {
    const { width: windowWidth } = Dimensions.get("window")
    const width = windowWidth / 5
    return {
        tabBarLabel: ({ focused }) => {
            const { authenticated } = directusStore()
            const { colors } = useColorScheme()
            const navigable = authenticated || navigableTabs.includes(label)
            const activeColor = focused ? (navigable ? colors.primary : colors.subtext) : colors["card-foreground"]

            return <View style={{ width, justifyContent: "center", alignItems: "center" }}>
                <View style={{
                    borderRadius: 9999,
                    paddingHorizontal: 16,
                    paddingVertical: 4,
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: focused ? opacity(activeColor, 0.1) : "transparent",
                }}>
                    {navigable ? <></> : <Lock
                        color={activeColor}
                        size={10}
                        style={{
                            position: "absolute",
                            top: 0,
                            right: 0,
                        }}
                    />
                    }
                    <Icon color={activeColor} size={20} />
                </View>
                <Text style={{
                    color: activeColor,
                    marginTop: 4,
                }}>{label}</Text>
            </View>
        },
    }
}

const navigableTabs = ["Home", "Listings"]