import { SafeAreaView } from "react-native-safe-area-context"

export default function HomeScreen() {
    return <SafeAreaView className="">
        <Text>Hello World</Text>
    </SafeAreaView>
}

import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { useColorScheme } from 'app/hooks/color-scheme';
import { LucideIcon, TrendingUp, Bell, MessageCircleMore, Bookmark, User } from "lucide-react-native";
import { Text } from 'app/components/ui/text';
import { Button } from 'app/components/ui/button';
import opacity from "hex-color-opacity";
import { View } from 'react-native';

const Tab = createMaterialTopTabNavigator();

export function ScreensLayout() {
    const { colors } = useColorScheme()
    const tabBarLabel = (Icon: LucideIcon, label: string, badgeCount?: number) => {
        // eslint-disable-next-line react/display-name
        return ({ focused }: { focused: boolean }) => <Button variant={"base"} size={"none"}>
            <View style={{ backgroundColor: focused ? opacity(colors.primary, 0.1) : "transparent" }} className='py-1 px-4 rounded-full relative'>
                {badgeCount ?
                    <View className='absolute -top-1/3 right-0 w-12 flex-row justify-end'>
                        <Text className='text-xs py-[1px] px-1 bg-primary text-primary-foreground rounded-full'>{badgeCount}</Text>
                    </View> : <></>}
                <Icon size={18} color={focused ? colors.primary : colors.secondary} />
            </View>
            <Text style={{ color: focused ? colors.primary : colors.foreground }} className='text-sm text-center'>{label}</Text>
        </Button>
    }

    return (
        <Tab.Navigator backBehavior="history" tabBarPosition='bottom' screenOptions={{
            tabBarStyle: { width: "100%" },
            tabBarContentContainerStyle: { justifyContent: "space-between" },
            tabBarAndroidRipple: { color: "transparent" },
            tabBarIndicator: () => null
        }}>
            <Tab.Screen name="(screens)/chat/index" component={HomeScreen} options={{
                tabBarLabel: tabBarLabel(MessageCircleMore, "Chat", 10),
            }} />
            <Tab.Screen name="(screens)/notifications" component={HomeScreen} options={{
                tabBarLabel: tabBarLabel(Bell, "Notifications"),
            }} />
            <Tab.Screen name='(screens)/index' component={HomeScreen} options={{
                tabBarLabel: tabBarLabel(TrendingUp, "Listings"),
            }} />
            <Tab.Screen name="(screens)/saved" component={HomeScreen} options={{
                tabBarLabel: tabBarLabel(Bookmark, "Bookmarks"),
            }} />
            <Tab.Screen name="(screens)/profile/index" component={HomeScreen} options={{
                tabBarLabel: tabBarLabel(User, "Profile"),
            }} />
        </Tab.Navigator>
    );
}