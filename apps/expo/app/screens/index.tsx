import { useEffect, useMemo, useState } from 'react';
import { View } from 'react-native';
import { createMaterialTopTabNavigator, MaterialTopTabBar } from '@react-navigation/material-top-tabs';
import { Bell, Lock, LogIn, LucideIcon, MessageCircleMore, Plus, TrendingUp, User } from "lucide-react-native";
import { Text } from 'app/components/ui/text';
import { useColorScheme } from 'app/hooks/color-scheme';
import { shortString } from 'app/lib/helpers';
import { getListingsCount } from 'app/lib/misc/get-counts';
import directusStore from 'app/store/directus';
import opacity from "hex-color-opacity";
import { useKeyboardVisible } from '../../hooks/keyboard';
import { HomeScreen } from './home';
import LoginScreen from './login';
import NotificationsScreen from './notifications';
import ProfileScreen from "./profile";
import { createStackNavigator } from '@react-navigation/stack';
import FullListingScreen from './home/detailed';

export function HomeScreen2() {
    return <View className="">
        <Text>Hello World</Text>
    </View>
}

const Tab = createMaterialTopTabNavigator();
const Stack = createStackNavigator()

export type RootStackParamList = {
    "app": undefined;
    "listing-detailed": { id: string };
}

const canNavigateTabs = ["Listings", "Login"];

const useTabBarLabel = (Icon: LucideIcon, label: string, badgeCount?: number) => {
    const { authenticated } = directusStore();
    const { colors } = useColorScheme();
    const canNavigate = authenticated || canNavigateTabs.includes(label);

    const TabBarLabelComponent = ({ focused }: { focused: boolean }) => (
        <View className='flex-col items-center'>
            <View style={{ backgroundColor: focused ? canNavigate ? opacity(colors.primary, 0.1) : opacity(colors.muted, 0.5) : "transparent" }} className='py-1 px-4 rounded-full relative w-16 mx-auto flex-row justify-center'>
                {badgeCount ?
                    <View className='absolute -top-1/3 right-0 w-12 flex-row justify-end'>
                        <Text className='text-xs py-[1px] px-1 bg-primary text-primary-foreground rounded-full'>{badgeCount}</Text>
                    </View> : null}
                {!canNavigate ?
                    <Lock className='absolute top-0 right-0 bottom-auto left-auto' size={8} color={colors['muted-foreground']} /> : null}
                <Icon size={18} color={canNavigate ? focused ? colors.primary : colors.secondary : colors['muted-foreground']} />
            </View>
            <Text style={{ color: canNavigate ? focused ? colors.primary : colors.secondary : colors['muted-foreground'] }} className='text-sm text-center'>{authenticated ? label : shortString(label, 6)}</Text>
        </View>
    );
    return TabBarLabelComponent;
};

const ScreensLayout = () => {
    const { colors } = useColorScheme();
    const { authenticated } = directusStore();

    const chatTabBarLabel = useTabBarLabel(MessageCircleMore, "Chat");
    const notificationsTabBarLabel = useTabBarLabel(Bell, "Notifications");
    const listingsTabBarLabel = useTabBarLabel(TrendingUp, "Listings");
    const postTabBarLabel = useTabBarLabel(Plus, "Post");
    const profileTabBarLabel = useTabBarLabel(User, "Profile");
    const loginTabBarLabel = useTabBarLabel(LogIn, "Login");

    const tabScreens = useMemo(() => [
        <Tab.Screen
            key="chat"
            name="chat"
            component={HomeScreen2}
            options={{
                tabBarLabel: chatTabBarLabel,
            }}
        />,
        <Tab.Screen
            key="notifications"
            name="notifications"
            component={NotificationsScreen}
            options={{
                tabBarLabel: notificationsTabBarLabel,
            }}
        />,
        <Tab.Screen
            key="home"
            name="home"
            component={HomeScreen}
            options={{
                tabBarLabel: listingsTabBarLabel,
            }}
        />,
        <Tab.Screen
            key="saved"
            name="post"
            component={HomeScreen2}
            options={{
                tabBarLabel: postTabBarLabel,
            }}
        />,
        <Tab.Screen
            key="profile"
            name="profile"
            component={ProfileScreen}
            options={{
                tabBarLabel: profileTabBarLabel,
            }}
        />,
    ], [chatTabBarLabel, notificationsTabBarLabel, listingsTabBarLabel, postTabBarLabel, profileTabBarLabel]);

    const [listingsCount, setListingsCount] = useState(0);
    const isKeyboardVisible = useKeyboardVisible();

    useEffect(() => {
        getListingsCount().then(setListingsCount);
    }, []);

    const finalTabScreens = useMemo(() => {
        if (!authenticated) {
            const position = 3;
            return [
                ...tabScreens.slice(0, position),
                <Tab.Screen
                    key="login"
                    name="/login"
                    component={LoginScreen}
                    options={{
                        tabBarLabel: loginTabBarLabel,
                    }}
                />,
                ...tabScreens.slice(position)
            ];
        }
        return tabScreens;
    }, [authenticated, tabScreens, loginTabBarLabel]);

    return finalTabScreens.length ? (
        <Tab.Navigator
            initialRouteName="/"
            backBehavior="history"
            tabBarPosition='bottom'
            tabBar={isKeyboardVisible ? () => null : MaterialTopTabBar}
            screenOptions={{
                tabBarAndroidRipple: {
                    color: "transparent"
                },
                tabBarIndicator: () => null
            }}
        >
            {finalTabScreens.map(screen => screen)}
        </Tab.Navigator>
    ) : null;
};

export default function AppLayout() {
    return <Stack.Navigator screenOptions={{ header: () => null }}>
        <Stack.Screen name="app" component={ScreensLayout} />
        <Stack.Screen name="listing-detailed" component={FullListingScreen} />
    </Stack.Navigator>
};