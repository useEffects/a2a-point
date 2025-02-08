import { BottomTabNavigationOptions } from '@react-navigation/bottom-tabs';
import { Dimensions, View, StyleSheet } from 'react-native';
import {
  BriefcaseBusiness,
  Building2,
  Phone,
  Shield,
  TrendingUp,
} from 'app/components/icons';
import { LucideIcon } from 'lucide-react-native';
import { Text } from 'app/components/ui/text';
import { useColorScheme } from 'app/hooks/color-scheme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { directusStore } from 'app/store/directus';
import { Tabs } from 'expo-router';
import { useKeyboard } from '../../hooks/keyboard';
import { createTabBarOptions } from '../(main)/_layout';

export default function AccountConsoleLayout() {
  const { width } = Dimensions.get('window');
  const { colors } = useColorScheme();
  const insets = useSafeAreaInsets();
  const { isKeyboardVisible } = useKeyboard();

  return (
    <Tabs
      backBehavior="history"
      tabBar={isKeyboardVisible ? () => null : undefined}
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
      initialRouteName="phone"
    >
      <Tabs.Screen
        name="phone"
        options={{ ...getTabItemsOptions('Phone', Phone) }}
      />
      <Tabs.Screen
        name="company"
        options={{ ...getTabItemsOptions('Company', Building2) }}
      />
      <Tabs.Screen
        name="membership"
        options={{ ...getTabItemsOptions('Membership', BriefcaseBusiness) }}
      />
      <Tabs.Screen
        name="verification"
        options={{ ...getTabItemsOptions('Verification', Shield) }}
      />
      <Tabs.Screen
        name="premium"
        options={{ ...getTabItemsOptions('Premium', TrendingUp) }}
      />
    </Tabs>
  );
}

const getTabItemsOptions = (label: string, Icon: LucideIcon) =>
  createTabBarOptions(label, Icon, [
    'Phone',
    'Company',
    'Verification',
    'Premium',
    'Membership',
  ]);
