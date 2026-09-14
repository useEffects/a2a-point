import { RangeSlider } from '@react-native-assets/slider';
import { Input } from 'app/components/ui/input';
import { Text } from 'app/components/ui/text';
import { useColorScheme } from 'app/hooks/color-scheme';
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
  const { colors } = useColorScheme();
  const { filters, setFilters } = useContext(RangeFilterContext);
  const onChange = (range: [number, number]) => {
    setFilters((p) => ({ ...p, range }));
  };

  return (
    <View>
      <RangeSlider
        style={{ paddingHorizontal: 8 }}
        inboundColor={colors.subtext}
        outboundColor={colors.foreground}
        thumbTintColor={colors.primary}
        crossingAllowed={false}
        trackHeight={1}
        thumbSize={12}
        trackStyle={{ height: 2 }}
        onValueChange={onChange}
        {...filters}
        {...props}
      />
    </View>
  );
};

RangeFilter.Input = ({
  className,
  minUnit = '',
  maxUnit = '',
}: {
  className?: string;
  minUnit?: string;
  maxUnit?: string;
}) => {
  const { filters, setFilters } = useContext(RangeFilterContext);

  const onChangeText = (key: 'maximumValue' | 'minimumValue') => {
    return (newVal: string) => {
      const newRange = [...filters.range!] as [number, number];
      const parsedNum = positiveNumberSchema.safeParse(
        newVal.replaceAll(',', ''),
      );
      if (!parsedNum.success) return;

      if (key === 'maximumValue') {
        newRange[1] = parsedNum.data;
      } else newRange[0] = parsedNum.data;

      setFilters((p) => ({ ...p, range: newRange }));
    };
  };

  return (
    <View className={cn('flex-row gap-4 items-center', className)}>
      {(
        [
          { label: `Minimum ${minUnit}`, key: 'minimumValue' },
          { label: `Maximum ${maxUnit}`, key: 'maximumValue' },
        ] as const
      ).map(({ label, key }) => (
        <View key={key} className="flex-col gap-2 flex-1">
          <Text>{label}</Text>
          <Input
            value={(key === 'minimumValue'
              ? filters.range?.[0]
              : filters.range?.[1]
            )?.toLocaleString()}
            onChangeText={onChangeText(key)}
            className="bg-card border-border"
            keyboardType="decimal-pad"
          />
        </View>
      ))}
    </View>
  );
};
