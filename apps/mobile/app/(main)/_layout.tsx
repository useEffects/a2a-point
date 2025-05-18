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

const { Navigator } = createMaterialTopTabNavigator();

export const MaterialTopTabs = withLayoutContext<
  MaterialTopTabNavigationOptions,
  typeof Navigator,
  TabNavigationState<ParamListBase>,
  MaterialTopTabNavigationEventMap
>(Navigator);

export default function TabLayout() {
  const { colors } = useColorScheme();
  const { width } = Dimensions.get('window');
  return (
    <MaterialTopTabs
      tabBarPosition="bottom"
      screenOptions={{
        tabBarStyle: {
          height: 60,
          backgroundColor: colors.accent,
          borderTopColor: colors.border,
          borderTopWidth: StyleSheet.hairlineWidth,
        },
        tabBarItemStyle: {
          width: width / 5,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-evenly',
          alignItems: 'center',
        },
        lazy: false,
      }}
      initialRouteName="index"
    >
      <MaterialTopTabs.Screen
        name="chat"
        options={getTabItemsOptions('Chat', MessageCircleMore)}
      />
      <MaterialTopTabs.Screen
        name="offplans"
        options={getTabItemsOptions('Offplans', Construction)}
      />
      <MaterialTopTabs.Screen
        name="index"
        options={getTabItemsOptions('Home', Home)}
      />
      <MaterialTopTabs.Screen
        name="listings"
        options={getTabItemsOptions('Listings', TrendingUp)}
      />
      <MaterialTopTabs.Screen
        name="agents/me"
        options={getTabItemsOptions('Profile', User)}
      />
    </MaterialTopTabs>
  );
}

export const getTabItemsOptions = (label: string, Icon: LucideIcon) =>
  createTabBarOptions(label, Icon, navigableTabs);

const navigableTabs = ['Home', 'Listings'];
