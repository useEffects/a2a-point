import { View, Text } from 'react-native';
import { Lock } from 'lucide-react-native';
import type { LucideIcon } from 'lucide-react-native';
import type { MaterialTopTabNavigationOptions } from '@react-navigation/material-top-tabs';
import { directusStore } from 'app/store/directus';
import { useColorScheme } from 'app/hooks/color-scheme';

type TabIconProps = {
  focused: boolean;
  Icon: LucideIcon;
  label: string;
  navigableTabs: string[];
};

const TabBarIcon: React.FC<TabIconProps> = ({
  focused,
  Icon,
  label,
  navigableTabs,
}) => {
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
      {!navigable && (
        <Lock
          color={activeColor}
          size={10}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
          }}
        />
      )}
      <Icon color={activeColor} fill={fillColor} size={20} />
    </View>
  );
};

const TabBarLabel: React.FC<{
  focused: boolean;
  label: string;
  navigableTabs: string[];
}> = ({ focused, label, navigableTabs }) => {
  const { authenticated } = directusStore();
  const { colors } = useColorScheme();
  const navigable = authenticated || navigableTabs.includes(label);

  const activeColor = focused
    ? navigable
      ? colors.primary
      : colors.subtext
    : colors['card-foreground'];

  return <Text style={{ color: activeColor, fontSize: 12 }}>{label}</Text>;
};

export const createTabBarOptions = (
  label: string,
  Icon: LucideIcon,
  navigableTabs: string[],
): MaterialTopTabNavigationOptions => ({
  tabBarIcon: (props) => (
    <TabBarIcon
      {...props}
      Icon={Icon}
      label={label}
      navigableTabs={navigableTabs}
    />
  ),
  tabBarLabel: (props) => (
    <TabBarLabel {...props} label={label} navigableTabs={navigableTabs} />
  ),
});
