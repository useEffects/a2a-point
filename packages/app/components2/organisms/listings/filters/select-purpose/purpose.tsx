import { Text } from 'app/components/ui/text';
import { useColorScheme } from 'app/hooks/color-scheme';
import { IconNode, LucideIcon } from 'lucide-react-native';
import { useContext } from 'react';
import { View } from 'react-native';
import { FiltersContext } from '../context';
import { cn } from 'app/lib/utils';

export const Purpose = (props: PurposeProps) => {
  const { Icon, label, metric } = props;
  const { colors } = useColorScheme();
  const { filters } = useContext(FiltersContext);
  const isSelected = filters.purpose?.find((p) => p === label);

  return (
    <View
      className={cn(
        'p-4 bg-card rounded-3xl flex-col gap-4 w-44 border border-solid border-border',
        isSelected && 'bg-primary',
      )}
    >
      <View className="flex-row justify-between items-center">
        <Text
          className={cn('text-info', isSelected && 'text-primary-foreground')}
        >
          {metric}+
        </Text>
        <View className="rounded-full self-start w-12 h-12 flex-row justify-center items-center bg-background">
          <Icon
            color={isSelected ? colors.primary : colors['card-foreground']}
            strokeWidth={1.5}
          />
        </View>
      </View>
      <Text className={cn('self-end', isSelected && 'text-primary-foreground')}>
        {label}
      </Text>
    </View>
  );
};

export type PurposeProps = {
  Icon: LucideIcon;
  label: string;
  metric: number;
};
