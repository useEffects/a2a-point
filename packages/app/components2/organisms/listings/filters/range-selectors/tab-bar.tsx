import { View } from 'react-native';
import { TabBarProps } from 'react-native-tab-view';
import { rangeSelectorsData, keyToIcon } from './utils';
import { useColorScheme } from 'app/hooks/color-scheme';
import { cn } from 'app/lib/utils';
import { Pressable } from 'app/components/pressable';
import { Text } from 'app/components/ui/text';

export const RangeSelectorsTabBar = (props: TabBarProps<{ key: string }>) => {
  const getIcon = (key: (typeof rangeSelectorsData)[number]['key']) =>
    keyToIcon[key];

  const { colors } = useColorScheme();
  const activeIndex = props.navigationState.index;

  const onPress = (key: (typeof rangeSelectorsData)[number]['key']) =>
    props.jumpTo(key);

  return (
    <View className="flex-row items-center gap-4">
      {rangeSelectorsData.map(({ key }, index) => {
        const Icon = getIcon(key);
        const activeLabelColor =
          activeIndex === index
            ? colors['secondary-foreground']
            : colors['card-foreground'];

        return (
          <Pressable
            className={cn(activeIndex === index && 'flex-1')}
            key={key}
            onPress={() => onPress(key)}
          >
            <View
              className={cn(
                'w-12 h-12 flex-row justify-center items-center bg-background rounded-full',
                activeIndex === index && 'bg-secondary w-auto gap-2 px-4',
              )}
            >
              <Icon color={activeLabelColor} size={18} />
              {index === activeIndex ? (
                <Text style={{ color: activeLabelColor }}>
                  {rangeSelectorsData[activeIndex]?.title}
                </Text>
              ) : (
                <></>
              )}
            </View>
          </Pressable>
        );
      })}
    </View>
  );
};
