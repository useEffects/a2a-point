import { MaterialTopTabBarProps, createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Separator } from 'app/components/ui/separator';
import { Text } from 'app/components/ui/text';
import { useColorScheme } from 'app/hooks/color-scheme';
import { shortString } from 'app/lib/helpers';
import { AccountConsoleParamList, MainTopTabParamList } from 'app/lib/misc/navigation';
import { getListingsCount } from 'app/lib/misc/queries';
import { cn } from 'app/lib/utils';
import ActivityScreen from 'app/screens/activity';
import ChatScreen from 'app/screens/chat';
import HomeScreen from 'app/screens/home';
import ListingsScreen from './listings';
import LocationsScreen from "./locations"
import OffPlansScreen from 'app/screens/offplans';
import directusStore from 'app/store/directus';
import opacity from "hex-color-opacity";
import { BriefcaseBusiness, Building2, Construction, Home, Lock, LucideIcon, MessageCircleMore, Phone, Shield, TrendingUp, User } from "lucide-react-native";
import { useEffect, useMemo, useState } from 'react';
import { Pressable, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useKeyboardVisible } from '../hooks/keyboard';
import { CompanySelectScreen } from './account-console/company';
import { MembershipScreen } from './account-console/membership';
import { PhoneVerificationScreen } from './account-console/phone';
import { VerificationScreen } from './account-console/verification';
import ListingDetailed from './listing-detailed';
import LocationDetailed from './location-detailed';
import LoginScreen from './login';
import { MembersList } from './members-list';
import NotificationsScreen from './notifications';
import PostScreen from './post';
import PostFeedback from './post-feedback';
import ProfileScreen from "./profile";
import ProfileDetailed from './profile-detailed';
import RoomDetailed from './room-detailed';
import { UsersListScreen } from './users-list';
import { PremiumCreditsScreen } from './account-console/premium';

const MainTab = createMaterialTopTabNavigator<MainTopTabParamList>();
const AccountConsoleTab = createMaterialTopTabNavigator<AccountConsoleParamList>();
const Stack = createStackNavigator()

const canNavigateTabs = ["Listings", "Home",];

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
    const profileTabBarLabel = useTabBarLabel(User, "Profile");
    const homeTabBarLabel = useTabBarLabel(Home, "Home");

    const tabScreens = useMemo(() => [
        <MainTab.Screen
            key="chats"
            name="chat"
            component={ChatScreen}
            options={{
                tabBarLabel: chatTabBarLabel,
            }}
        />,
        <MainTab.Screen
            key="offPlans"
            name="offPlans"
            component={OffPlansScreen}
            options={{
                tabBarLabel: notificationsTabBarLabel,
            }}
        />,
        <MainTab.Screen
            key="home"
            name="home"
            component={HomeScreen}
            options={{
                tabBarLabel: homeTabBarLabel,
            }}
        />,
        <MainTab.Screen
            key="listings"
            name="listings"
            component={ListingsScreen}
            options={{
                tabBarLabel: listingsTabBarLabel,
            }}
        />,
        <MainTab.Screen
            key="profile"
            name="profile"
            component={ProfileScreen}
            options={{
                tabBarLabel: profileTabBarLabel,
            }}
        />,
    ], [chatTabBarLabel, notificationsTabBarLabel, listingsTabBarLabel, homeTabBarLabel, profileTabBarLabel]);

    const [listingsCount, setListingsCount] = useState(0);

    useEffect(() => {
        getListingsCount().then(setListingsCount);
    }, []);

    return <MainTab.Navigator
        initialRouteName={"home"}
        backBehavior="history"
        tabBarPosition='bottom'
        tabBar={CustomTabBar}
        screenOptions={{
            tabBarAndroidRipple: {
                color: "transparent"
            },
            tabBarIndicator: () => null,
            tabBarContentContainerStyle: {
                justifyContent: "space-between",
            },
            animationEnabled: false
        }}
    >
        {tabScreens}
    </MainTab.Navigator>
};

const AccountConsoleLayout = () => {
    const phoneTabBarLabel = useTabBarLabel(Phone, "Phone");
    const companyTabBarLabel = useTabBarLabel(Building2, "Company");
    const membershipTabBarLabel = useTabBarLabel(BriefcaseBusiness, "Membership");
    const verificationTabBarLabel = useTabBarLabel(Shield, "Verification");
    const premiumTopBarLabel = useTabBarLabel(TrendingUp, "Premium");

    return <AccountConsoleTab.Navigator tabBar={CustomTabBar} tabBarPosition='bottom' screenOptions={{ animationEnabled: false }}>
        <AccountConsoleTab.Screen
            key={"phone"}
            name='phone'
            component={PhoneVerificationScreen}
            options={{
                tabBarLabel: phoneTabBarLabel,
            }}
        />
        <AccountConsoleTab.Screen
            key={"company"}
            name='company'
            component={CompanySelectScreen}
            options={{
                tabBarLabel: companyTabBarLabel,
            }}
        />
        <AccountConsoleTab.Screen
            key={"membership"}
            name='membership'
            component={MembershipScreen}
            options={{
                tabBarLabel: membershipTabBarLabel,
            }}
        />
        <AccountConsoleTab.Screen
            key={"verification"}
            name='verification'
            component={VerificationScreen}
            options={{
                tabBarLabel: verificationTabBarLabel,
            }}
        />
        <AccountConsoleTab.Screen
            key={"premium"}
            name='premium'
            component={PremiumCreditsScreen}
            options={{
                tabBarLabel: premiumTopBarLabel,
            }}
        />
    </AccountConsoleTab.Navigator>
}

export default function AppLayout() {
    return <Stack.Navigator initialRouteName='app' screenOptions={{ header: () => null }}>
        <Stack.Screen name="app" component={ScreensLayout} />
        <Stack.Screen name="account-console" component={AccountConsoleLayout} />
        <Stack.Screen name="listing-detailed" component={ListingDetailed} />
        <Stack.Screen name="location-detailed" component={LocationDetailed} />
        <Stack.Screen name="room-detailed" component={RoomDetailed} />
        <Stack.Screen name="profile-detailed" component={ProfileDetailed} />
        <Stack.Screen name="members-list" component={MembersList} />
        <Stack.Screen name="post-feedback" component={PostFeedback} />
        <Stack.Screen name="activity" component={ActivityScreen} />
        <Stack.Screen name="notifications" component={NotificationsScreen} />
        <Stack.Screen name="login" component={LoginScreen} />
        <Stack.Screen name="post" component={PostScreen} />
        <Stack.Screen name="locations-list" component={LocationsScreen} />
        <Stack.Screen name="users-list" component={UsersListScreen} />
    </Stack.Navigator>
};

const CustomTabBar: React.FC<MaterialTopTabBarProps> = ({ state, descriptors, navigation }) => {
    const insets = useSafeAreaInsets();
    const isKeyboardVisible = useKeyboardVisible();

    return isKeyboardVisible ? <></> : (
        <View>
            <Separator />
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
        </View>
    );
};