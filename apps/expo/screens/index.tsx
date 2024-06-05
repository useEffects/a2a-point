import { MaterialTopTabBarProps, createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Text } from 'app/components/ui/text';
import { useColorScheme } from 'app/hooks/color-scheme';
import { shortString } from 'app/lib/helpers';
import { getListingsCount } from 'app/lib/misc/get-counts';
import { TopTabParamList } from 'app/lib/misc/navigation';
import { cn } from 'app/lib/utils';
import directusStore from 'app/store/directus';
import opacity from "hex-color-opacity";
import { Construction, Lock, LucideIcon, MessageCircleMore, Plus, TrendingUp, User } from "lucide-react-native";
import { useEffect, useMemo, useState } from 'react';
import { Pressable, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useKeyboardVisible } from '../hooks/keyboard';
import ChatScreen from './chat';
import { HomeScreen } from './home';
import FullListingScreen from './listing-detailed';
import LocationListings from './location-listings';
import LoginScreen from './login';
import NotificationsScreen from './notifications';
import PostScreen from './post';
import PostFeedback from './post-feedback';
import ProfileScreen from "./profile";
import ProfileDetailed from './profile-detailed';
import RoomDetailed from './room-detailed';
import ActivityScreen from './activity';
import OffPlansScreen from './offplans';

const Tab = createMaterialTopTabNavigator<TopTabParamList>();
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
        <View className='flex-col items-center w-full'>
            <View style={{ backgroundColor: focused ? canNavigate ? opacity(colors.primary, 0.1) : opacity(colors['muted-foreground'], 0.1) : "transparent" }} className={cn("w-16 p-1 rounded-full relative mx-auto flex-row justify-center")}>
                {badgeCount ?
                    <View className='absolute -top-1/3 right-0 w-12 flex-row justify-end'>
                        <Text className='text-xs py-[1px] px-1 bg-primary text-primary-foreground rounded-full'>{badgeCount}</Text>
                    </View> : null}
                {!canNavigate ?
                    <Lock className='absolute top-0 right-0 bottom-auto left-auto' size={8} color={colors['muted-foreground']} /> : null}
                <Icon size={18} color={canNavigate ? focused ? colors.primary : colors.secondary : colors['muted-foreground']} />
            </View>
            <Text style={{ color: canNavigate ? focused ? colors.primary : colors.secondary : colors['muted-foreground'] }} className='text-sm text-center'>{authenticated ? label : shortString(label, 8)}</Text>
        </View>
    );
    return TabBarLabelComponent;
};

const ScreensLayout = () => {

    const chatTabBarLabel = useTabBarLabel(MessageCircleMore, "Chat");
    const notificationsTabBarLabel = useTabBarLabel(Construction, "Off Plans");
    const listingsTabBarLabel = useTabBarLabel(TrendingUp, "Listings");
    const postTabBarLabel = useTabBarLabel(Plus, "Post");
    const profileTabBarLabel = useTabBarLabel(User, "Profile");

    const tabScreens = useMemo(() => [
        <Tab.Screen
            key="chats"
            name="chat"
            component={ChatScreen}
            options={{
                tabBarLabel: chatTabBarLabel,
            }}
        />,
        <Tab.Screen
            key="offPlans"
            name="offPlans"
            component={OffPlansScreen}
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
            component={PostScreen}
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

    return <Tab.Navigator
        initialRouteName={"home"}
        backBehavior="history"
        tabBarPosition='bottom'
        tabBar={isKeyboardVisible ? () => null : CustomTabBar}
        screenOptions={{
            tabBarAndroidRipple: {
                color: "transparent"
            },
            tabBarIndicator: () => null,
            tabBarContentContainerStyle: {
                justifyContent: "space-between",
            },
        }}
    >
        {tabScreens}
    </Tab.Navigator>
};

export default function AppLayout() {
    return <Stack.Navigator screenOptions={{ header: () => null }}>
        <Stack.Screen name="app" component={ScreensLayout} />
        <Stack.Screen name="listing-detailed" component={FullListingScreen} />
        <Stack.Screen name="room-detailed" component={RoomDetailed} />
        <Stack.Screen name="profile-detailed" component={ProfileDetailed} />
        <Stack.Screen name="location-listings" component={LocationListings} />
        <Stack.Screen name="post-feedback" component={PostFeedback} />
        <Stack.Screen name="activity" component={ActivityScreen} />
        <Stack.Screen name="notifications" component={NotificationsScreen} />
        <Stack.Screen name="login" component={LoginScreen} />
    </Stack.Navigator>
};

const CustomTabBar: React.FC<MaterialTopTabBarProps> = ({ state, descriptors, navigation }) => {
    const insets = useSafeAreaInsets();

    return (
        <View style={{ paddingBottom: insets.bottom }} className='flex-row items-center h-20 bg-card'>
            {state.routes.map((route, index) => {
                const { options } = descriptors[route.key]!;
                const label =
                    options.tabBarLabel !== undefined
                        ? options.tabBarLabel
                        : options.title !== undefined
                            ? options.title
                            : route.name;

                const isFocused = state.index === index;

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
                    <Pressable
                        key={index}
                        onPress={onPress}
                        onLongPress={onLongPress}
                        className='flex-1'
                    >
                        {typeof label === "function" ? label({ focused: isFocused, children: '', color: '' }) : label}
                    </Pressable>
                );
            })}
        </View>
    );
};