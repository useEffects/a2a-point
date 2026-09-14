import { useColorScheme } from 'app/hooks/color-scheme';
import { Switch as RNSwitch, SwitchProps } from 'react-native-switch';

export const Switch = (props: SwitchProps) => {
  const { colors } = useColorScheme();

  return (
    <RNSwitch
      backgroundActive={colors.secondary}
      backgroundInactive={colors.accent}
      activeTextStyle={{ color: colors['secondary-foreground'] }}
      inactiveTextStyle={{ color: colors['card-foreground'] }}
      circleActiveColor={colors['secondary-foreground']}
      circleBorderActiveColor={colors.secondary}
      circleInActiveColor={colors['card-foreground']}
      circleBorderInactiveColor={colors.accent}
      switchWidthMultiplier={1.66}
      {...props}
    />
  );
};
