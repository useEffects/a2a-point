import { Pressable } from 'app/components/pressable';
import { Button } from 'app/components/ui/button';
import { useColorScheme } from 'app/hooks/color-scheme';
import { cn } from 'app/lib/utils';
import { ArrowLeft, ArrowRight, LucideIcon } from 'lucide-react-native';
import { View } from 'react-native';
import { TabBarProps } from 'react-native-tab-view';

export const TabBarWithIcon =
  (routes: { key: string }[], iconMap: Record<string, LucideIcon>) =>
  (props: TabBarProps<{ key: string }>) => {
    const activeIndex = props.navigationState.index;
    const { colors } = useColorScheme();
    return (
      <View className="flex-row gap-4 items-center">
        {routes.map(({ key }) => {
          const Icon = iconMap[key];
          const active = routes.findIndex((r) => r.key === key) === activeIndex;
          if (!Icon) throw new Error(`Icon missing for ${key}`);
          return (
            <Pressable
              onPress={() => props.jumpTo(key)}
              key={key}
              className={cn(
                'p-4 rounded-full',
                active ? 'bg-secondary' : 'bg-card',
              )}
            >
              <Icon
                color={
                  active
                    ? colors['secondary-foreground']
                    : colors['card-foreground']
                }
                size={18}
              />
            </Pressable>
          );
        })}
        {/* <View className="ml-auto mr-0 flex-row gap-2">
          <Button
            variant={'base'}
            size={'smallIcon'}
            className="border border-info border-solid"
            onPress={() => props.jumpTo(routes[activeIndex - 1]?.key!)}
            disabled={activeIndex === 0}
          >
            <ArrowLeft color={colors.info} size={18} />
          </Button>
          <Button
            variant={'base'}
            size={'smallIcon'}
            className="border border-info border-solid"
            onPress={() => props.jumpTo(routes[activeIndex + 1]?.key!)}
            disabled={activeIndex === routes.length - 1}
          >
            <ArrowRight color={colors.info} size={18} />
          </Button>
        </View> */}
      </View>
    );
  };
