import { View } from 'react-native';
import { TabBarProps } from 'react-native-tab-view';
import { rangeSelectorsData, keyToIcon } from './utils';
import { useColorScheme } from 'app/hooks/color-scheme';
import { cn } from 'app/lib/utils';

export const RangeSelectorsTabBar = (
  props: TabBarProps<{ key: string; title: string }>,
) => {
  const getIcon = (key: string) => keyToIcon[key]!;
  const { colors } = useColorScheme();
  const activeIndex = props.navigationState.index;

  return (
    <View className="flex-row items-center gap-4">
      {rangeSelectorsData.map(({ key, title }, index) => {
        const Icon = getIcon(key);

        return (
          <View key={key}>
            <View
              className={cn(
                'w-12 h-12 flex-row justify-center items-center bg-background rounded-full',
                activeIndex === index && 'bg-secondary',
              )}
            >
              <Icon
                color={
                  activeIndex === index
                    ? colors['secondary-foreground']
                    : colors['card-foreground']
                }
                size={18}
              />
            </View>
          </View>
        );
      })}
    </View>
  );
};
