import { Text } from 'app/components/ui/text';
import { useColorScheme } from 'app/hooks/color-scheme';
import { Award, Info } from 'lucide-react-native';
import { View } from 'react-native';
import { Purpose, PurposeProps } from './purpose';
import { HorizontalFlatList } from 'app/components/utils/virtual-lists';

export const SelectPurpose = () => {
  return (
    <View className="flex-col gap-4 px-4">
      <Text className="text-lg">Select Type</Text>
      <HorizontalFlatList
        data={purposes}
        renderItem={({ item }) => <Purpose {...item} />}
        numRows={1}
        keyExtractor={(item) => item.label}
      />
    </View>
  );
};

const purposes: PurposeProps[] = [
  {
    Icon: Award,
    label: 'Premium',
    metric: 1,
  },
];
