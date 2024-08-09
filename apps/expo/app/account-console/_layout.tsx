import {
    MaterialTopTabNavigationEventMap,
    MaterialTopTabNavigationOptions,
    createMaterialTopTabNavigator,
} from "@react-navigation/material-top-tabs";
import { withLayoutContext } from "expo-router";
import { ParamListBase, TabNavigationState } from "@react-navigation/native";
import { Dimensions, View } from "react-native";
import { BriefcaseBusiness, Building2, Phone, Shield, TrendingUp } from "app/components/icons";
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

export default function AccountConsoleLayout() {
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
            initialRouteName="phone"
        >
            <MaterialTopTabs.Screen name="phone" options={{ ...getTabItemsOptions("Phone", Phone) }} />
            <MaterialTopTabs.Screen name="company" options={{ ...getTabItemsOptions("Company", Building2) }} />
            <MaterialTopTabs.Screen name="membership" options={{ ...getTabItemsOptions("Membership", BriefcaseBusiness) }} />
            <MaterialTopTabs.Screen name="verification" options={{ ...getTabItemsOptions("Verification", Shield) }} />
            <MaterialTopTabs.Screen name="premium" options={{ ...getTabItemsOptions("Premium", TrendingUp) }} />
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
            const activeColor = focused ? colors.primary : colors["card-foreground"]

            return <View style={{ width, justifyContent: "center", alignItems: "center" }}>
                <View style={{
                    borderRadius: 9999,
                    paddingHorizontal: 16,
                    paddingVertical: 4,
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: focused ? opacity(activeColor, 0.1) : "transparent",
                }}>
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