import { RangeFilter } from 'app/components2/molecules/range-filter/component';
import { View } from 'react-native';

export const PriceScene = () => {
  return (
    <View className="p-4 flex-1">
      <RangeFilter
        initialFilters={{
          maximumValue: 1000000,
          minimumValue: 100000,
          range: [100000, 1000000],
        }}
      >
        <View className="flex-col gap-4">
          <RangeFilter.Slider />
          <RangeFilter.Input />
        </View>
      </RangeFilter>
    </View>
  );
};
