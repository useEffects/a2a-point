import { BottomTabNavigationOptions } from '@react-navigation/bottom-tabs';
import { useColorScheme } from 'app/hooks/color-scheme';
import { Tabs } from 'expo-router';
import { Dimensions, Text, View } from 'react-native';
import { directusStore } from 'app/store/directus';
import { LucideIcon } from 'lucide-react-native';
import {
  Construction,
  Home,
  Lock,
  MessageCircleMore,
  TrendingUp,
  User,
} from 'app/components/icons';
import { StyleSheet } from 'react-native';

export default function MainLayout() {
  const { colors } = useColorScheme();
  const { width } = Dimensions.get('window');
  return (
    <Tabs
      screenOptions={{
        header: () => null,
        tabBarStyle: {
          backgroundColor: colors.card,
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
      }}
    >
      <Tabs.Screen
        name="chat"
        options={{ ...getTabItemsOptions('Chat', MessageCircleMore) }}
      />
      <Tabs.Screen
        name="offplans"
        options={{ ...getTabItemsOptions('Offplans', Construction) }}
      />
      <Tabs.Screen
        name="index"
        options={{ ...getTabItemsOptions('Home', Home) }}
      />
      <Tabs.Screen
        name="listings"
        options={{ ...getTabItemsOptions('Listings', TrendingUp) }}
      />
      <Tabs.Screen
        name="agents/me"
        options={{ ...getTabItemsOptions('Profie', User) }}
      />
    </Tabs>
  );
}

const getTabItemsOptions = (
  label: string,
  Icon: LucideIcon,
): BottomTabNavigationOptions => {
  return {
    tabBarIcon: ({ focused }) => {
      const { authenticated } = directusStore();
      const { colors } = useColorScheme();
      const navigable = authenticated || navigableTabs.includes(label);
      const activeColor = focused
        ? navigable
          ? colors.primary
          : colors.subtext
        : colors['card-foreground'];
      const fillColor = focused
        ? navigable
          ? colors.primary
          : colors.subtext
        : 'transparent';

      return (
        <View
          style={{
            paddingHorizontal: 16,
            paddingVertical: 4,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          {navigable ? (
            <></>
          ) : (
            <Lock
              color={activeColor}
              size={10}
              style={{
                position: 'absolute',
                top: 0,
                right: 'auto',
                left: 0,
              }}
            />
          )}
          <Icon color={activeColor} fill={fillColor} size={20} />
        </View>
      );
    },
    tabBarLabel: ({ focused }) => {
      const { authenticated } = directusStore();
      const { colors } = useColorScheme();
      const navigable = authenticated || navigableTabs.includes(label);
      const activeColor = focused
        ? navigable
          ? colors.primary
          : colors.subtext
        : colors['card-foreground'];

      return <Text style={{ color: activeColor, fontSize: 12 }}>{label}</Text>;
    },
  };
};

const navigableTabs = ['Home', 'Listings'];
