import { RangeSlider } from '@react-native-assets/slider';
import { Input } from 'app/components/ui/input';
import { Text } from 'app/components/ui/text';
import { positiveNumberSchema } from 'app/lib/schemas/postive-number';
import { cn } from 'app/lib/utils';
import {
  ComponentProps,
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useState,
} from 'react';
import { View } from 'react-native';

type RangeSliderParams = Pick<
  ComponentProps<typeof RangeSlider>,
  'minimumValue' | 'maximumValue' | 'range'
>;

const RangeFilterContext = createContext<{
  filters: RangeSliderParams;
  setFilters: Dispatch<SetStateAction<RangeSliderParams>>;
}>({ filters: {}, setFilters: () => {} });

export const RangeFilter = ({
  children,
  initialFilters = {},
}: {
  children: ReactNode;
  initialFilters?: RangeSliderParams;
}) => {
  const [filters, setFilters] = useState<RangeSliderParams>(initialFilters);

  return (
    <RangeFilterContext.Provider value={{ filters, setFilters }}>
      {children}
    </RangeFilterContext.Provider>
  );
};

RangeFilter.Slider = (props: ComponentProps<typeof RangeSlider>) => {
  return (
    <View>
      <RangeSlider {...props} />
    </View>
  );
};

RangeFilter.Input = ({ className }: { className?: string }) => {
  const { filters, setFilters } = useContext(RangeFilterContext);

  const onChangeText = (key: 'maximumValue' | 'minimumValue') => {
    return (newVal: string) => {
      positiveNumberSchema.safeParse(newVal).success
        ? setFilters((p) => ({ ...p, [key]: Number(newVal) }))
        : undefined;
    };
  };

  return (
    <View className={cn('flex-row gap-4 items-center', className)}>
      {(
        [
          { label: 'Maximum', key: 'maximumValue' },
          { label: 'Minimum', key: 'minimumValue' },
        ] as const
      ).map(({ label, key }) => (
        <View key={key} className="flex-col gap-2 flex-1">
          <Text>{label}</Text>
          <Input
            value={filters[key]?.toLocaleString()}
            onChangeText={onChangeText(key)}
            className="bg-card border-border"
          />
        </View>
      ))}
    </View>
  );
};
