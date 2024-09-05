import { BottomTabNavigationOptions } from "@react-navigation/bottom-tabs";
import { Dimensions, View } from "react-native";
import { BriefcaseBusiness, Building2, Phone, Shield, TrendingUp } from "app/components/icons";
import { LucideIcon } from "lucide-react-native";
import { Text } from "app/components/ui/text";
import { useColorScheme } from "app/hooks/color-scheme";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import directusStore from "app/store/directus";
import { Tabs } from "expo-router";
import { useKeyboard } from "../../hooks/keyboard";

export default function AccountConsoleLayout() {
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
            initialRouteName="phone"
        >
            <Tabs.Screen name="phone" options={{ ...getTabItemsOptions("Phone", Phone) }} />
            <Tabs.Screen name="company" options={{ ...getTabItemsOptions("Company", Building2) }} />
            <Tabs.Screen name="membership" options={{ ...getTabItemsOptions("Membership", BriefcaseBusiness) }} />
            <Tabs.Screen name="verification" options={{ ...getTabItemsOptions("Verification", Shield) }} />
            <Tabs.Screen name="premium" options={{ ...getTabItemsOptions("Premium", TrendingUp) }} />
        </Tabs>
    );
}

const getTabItemsOptions = (label: string, Icon: LucideIcon): BottomTabNavigationOptions => {
    return {
        tabBarIcon: ({ focused }) => {
            const { colors } = useColorScheme()
            const activeColor = focused ? colors.primary : colors["card-foreground"]
            const fillColor = focused ? colors.primary : "transparent"

            return <Icon color={activeColor} fill={fillColor} size={24} />
        },
        tabBarLabel: ({ focused }) => {
            const { authenticated } = directusStore()
            const { colors } = useColorScheme()
            const activeColor = focused ? colors.primary : colors["card-foreground"]

            return <Text style={{ color: activeColor, fontSize: 12 }}>
                {label}
            </Text>
        }
    }
}