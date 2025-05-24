import {
  MaterialTopTabNavigationEventMap,
  MaterialTopTabNavigationOptions,
  createMaterialTopTabNavigator,
} from '@react-navigation/material-top-tabs';
import { withLayoutContext } from 'expo-router';
import { ParamListBase, TabNavigationState } from '@react-navigation/native';
import {
  Construction,
  Home,
  LucideIcon,
  MessageCircleMore,
  TrendingUp,
  User,
} from 'lucide-react-native';
import { createTabBarOptions } from '../../lib/layout-utils';
import { useColorScheme } from 'app/hooks/color-scheme';
import { Dimensions, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { Navigator } = createMaterialTopTabNavigator();

export const MaterialTopTabs = withLayoutContext<
  MaterialTopTabNavigationOptions,
  typeof Navigator,
  TabNavigationState<ParamListBase>,
  MaterialTopTabNavigationEventMap
>(Navigator);

const tabs = [
  { name: 'chat', label: 'Chat', icon: MessageCircleMore },
  { name: 'offplans', label: 'Offplans', icon: Construction },
  { name: 'index', label: 'Home', icon: Home },
  { name: 'listings', label: 'Listings', icon: TrendingUp },
  { name: 'agents/me', label: 'Profile', icon: User },
];

const navigableTabs = ['Home', 'Listings'];

const getTabItemsOptions = (label: string, Icon: LucideIcon) =>
  createTabBarOptions(label, Icon, navigableTabs);

export default function MainTabLayout() {
  const { colors } = useColorScheme();
  const { width } = Dimensions.get('window');
  const { bottom: paddingBottom } = useSafeAreaInsets();

  return (
    <MaterialTopTabs
      tabBarPosition="bottom"
      screenOptions={{
        tabBarStyle: {
          height: 56 + paddingBottom,
          backgroundColor: colors.accent,
          borderTopColor: colors.border,
          borderTopWidth: StyleSheet.hairlineWidth,
          paddingBottom: paddingBottom,
        },
        tabBarItemStyle: {
          width: width / 5,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-evenly',
          alignItems: 'center',
        },
        lazy: false,
        tabBarAndroidRipple: {
          radius: 0,
          color: 'transparent',
        },
        tabBarIndicator: () => null,
      }}
      initialRouteName="index"
    >
      {tabs.map(({ name, label, icon }) => (
        <MaterialTopTabs.Screen
          key={name}
          name={name}
          options={getTabItemsOptions(label, icon)}
        />
      ))}
    </MaterialTopTabs>
  );
}
