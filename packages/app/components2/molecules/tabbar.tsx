import { Pressable } from 'app/components/pressable';
import { Button } from 'app/components/ui/button';
import { useColorScheme } from 'app/hooks/color-scheme';
import { cn } from 'app/lib/utils';
import { ArrowLeft, ArrowRight } from 'lucide-react-native';
import { View } from 'react-native';
import { TabBarProps } from 'react-native-tab-view';

export const TabBar =
  (routes: { key: string }[]) => (props: TabBarProps<{ key: string }>) => {
    const activeIndex = props.navigationState.index;
    const { colors } = useColorScheme();
    return (
      <View className="flex-row gap-4 items-center">
        {routes.map(({ key }) => (
          <Pressable
            onPress={() => props.jumpTo(key)}
            key={key}
            className={cn(
              'w-4 h-4 rounded-full',
              routes.findIndex((r) => r.key === key) === activeIndex
                ? 'bg-secondary'
                : 'bg-popover',
            )}
          />
        ))}
        <View className="ml-auto mr-0 flex-row gap-2">
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
        </View>
      </View>
    );
  };
