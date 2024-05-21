export default function HomeScreen2() {
    return <View className="">
        <Text>Hello World</Text>
    </View>
}

import { MaterialTopTabBarProps, createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { useColorScheme } from 'app/hooks/color-scheme';
import { LucideIcon, TrendingUp, Bell, MessageCircleMore, Plus, User, LogIn, Lock } from "lucide-react-native";
import { Text } from 'app/components/ui/text';
import { Button } from 'app/components/ui/button';
import opacity from "hex-color-opacity";
import { View } from 'react-native';
import ProfileScreen from "./profile";
import { HomeScreen } from './home';
import { getListingsCount } from 'app/lib/misc/get-counts';
import { useCallback, useEffect, useState } from 'react';
import NotificationsScreen from './notifications';
import { useKeyboardVisible } from '../../hooks/keyboard';
import LoginScreen from './login';
import { shortString } from 'app/lib/helpers';
import directusStore from 'app/store/directus';

const Tab = createMaterialTopTabNavigator();

const _hiddenTabs = ["/listing-detailed"]
const canNavigateTabs = ["Listings", "Login"]

export function ScreensLayout() {
    const { authenticated } = directusStore()
    const { colors } = useColorScheme()

    const tabBarLabel = useCallback((Icon: LucideIcon, label: string, badgeCount?: number) => {
        const canNavigate = authenticated || canNavigateTabs.includes(label)
        // eslint-disable-next-line react/display-name
        return ({ focused }: { focused: boolean }) => <View className='flex-col items-center'>
            <View style={{ backgroundColor: focused ? canNavigate ? opacity(colors.primary, 0.1) : opacity(colors.muted, 0.5) : "transparent" }} className='py-1 px-4 rounded-full relative w-16 mx-auto flex-row justify-center'>
                {badgeCount ?
                    <View className='absolute -top-1/3 right-0 w-12 flex-row justify-end'>
                        <Text className='text-xs py-[1px] px-1 bg-primary text-primary-foreground rounded-full'>{badgeCount}</Text>
                    </View> : <></>}
                {!canNavigate ?
                    <Lock className='absolute top-0 right-0 bottom-auto left-auto' size={8} color={colors['muted-foreground']} /> : <></>}
                <Icon size={18} color={canNavigate ? focused ? colors.primary : colors.secondary : colors['muted-foreground']} />
            </View>
            <Text style={{ color: canNavigate ? focused ? colors.primary : colors.secondary : colors['muted-foreground'] }} className='text-sm text-center'>{authenticated ? label : shortString(label, 6)}</Text>
        </View>
    }, [authenticated, colors])

    const _tabScreens = [
        <Tab.Screen
            key={0}
            name="(screens)/chat/index"
            component={HomeScreen2}
            options={{
                tabBarLabel: tabBarLabel(MessageCircleMore, "Chat"),
            }}
        />,
        <Tab.Screen
            key={1}
            name="(screens)/notifications"
            component={NotificationsScreen}
            options={{
                tabBarLabel: tabBarLabel(Bell, "Notifications"),
            }}
        />,
        <Tab.Screen
            key={2}
            name="/"
            component={HomeScreen}
            options={{
                tabBarLabel: tabBarLabel(TrendingUp, "Listings"),
            }}
        />,
        <Tab.Screen
            key={3}
            name="(screens)/saved"
            component={HomeScreen2}
            options={{
                tabBarLabel: tabBarLabel(Plus, "Post"),
            }}
        />,
        <Tab.Screen
            key={4}
            name="(screens)/profile/index"
            component={ProfileScreen}
            options={{
                tabBarLabel: tabBarLabel(User, "Profile"),
            }}
        />,
    ];
    const [listingsCount, setListingsCount] = useState(0)
    const isKeyboardVisible = useKeyboardVisible()
    const [hiddenTabs, setHiddenTabs] = useState<string[]>(_hiddenTabs)
    const [tabScreens, setTabScreens] = useState(_tabScreens)

    useEffect(() => {
        getListingsCount().then(setListingsCount)
    }, [])

    useEffect(() => {
        if (!authenticated) {
            setTabScreens(p => [...p, (<Tab.Screen
                key={5}
                name="/login"
                component={LoginScreen}
                options={{
                    tabBarLabel: tabBarLabel(LogIn, "Login"),
                }}
            />)])
        } else {
            setTabScreens(p => p.filter(tab => tab.props.name !== "/login"))
        }
    }, [authenticated, tabBarLabel])


    return (
        <Tab.Navigator
            initialRouteName="/" backBehavior="history" tabBarPosition='bottom'
            tabBar={(props) => isKeyboardVisible ? <></> : <CustomTabBar {...props} hiddenTabs={hiddenTabs} />}
        >
            {tabScreens.map(screen => screen)}
        </Tab.Navigator>
    );
}

const CustomTabBar = ({ state, descriptors, navigation, hiddenTabs }: MaterialTopTabBarProps & { hiddenTabs?: string[] }) => {
    return (
        <View className='w-full flex-row justify-between bg-card py-2 items-center'>
            {state.routes.map((route, index) => {
                const { options } = descriptors[route.key]!;
                const label = options.tabBarLabel;
                const isFocused = state.index === index;

                // Skip rendering this tab if it's in the hiddenTabs array
                if (hiddenTabs?.includes(route.name)) {
                    return null;
                }

                const onPress = () => {
                    const event = navigation.emit({
                        type: 'tabPress',
                        target: route.key,
                        canPreventDefault: true,
                    });

                    if (!isFocused && !event.defaultPrevented) {
                        navigation.navigate(route.name);
                    }
                };

                const onLongPress = () => {
                    navigation.emit({
                        type: 'tabLongPress',
                        target: route.key,
                    });
                };

                return (
                    <Button variant={"base"} size={"none"}
                        key={route.key}
                        accessibilityState={isFocused ? { selected: true } : {}}
                        accessibilityLabel={options.tabBarAccessibilityLabel}
                        testID={options.tabBarTestID}
                        onPress={onPress}
                        onLongPress={onLongPress}
                        style={{ flex: 1, alignItems: 'center' }}
                    >
                        <View>
                            {typeof label === "function" ? label({
                                focused: isFocused,
                                color: '',
                                children: ''
                            }) : label}
                        </View>
                    </Button>
                );
            })}
        </View>
    );
};