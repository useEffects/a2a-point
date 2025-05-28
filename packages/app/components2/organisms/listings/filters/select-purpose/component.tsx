import { Text } from 'app/components/ui/text';
import { useColorScheme } from 'app/hooks/color-scheme';
import {
  Award,
  CreditCard,
  HandHeart,
  Handshake,
  HousePlus,
  Info,
  Sparkles,
} from 'lucide-react-native';
import { View } from 'react-native';
import { Purpose, PurposeProps } from './purpose';
import { HorizontalFlatList } from 'app/components/utils/virtual-lists';

export const SelectPurpose = () => {
  return (
    <View className="flex-col gap-4 flex-1">
      <Text className="text-lg">Select Type</Text>
      <HorizontalFlatList
        data={purposes}
        renderItem={({ item }) => <Purpose {...item} />}
        numRows={1}
        keyExtractor={(item) => item.label}
        ItemSeparatorComponent={() => <View className="w-4 h-4" />}
        contentContainerStyle={{ flexGrow: 1 }}
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
  {
    Icon: Sparkles,
    label: 'Sale',
    metric: 20,
  },
  {
    Icon: CreditCard,
    label: 'Buy',
    metric: 5,
  },
  {
    Icon: HousePlus,
    label: 'Give on Rent',
    metric: 10,
  },
  {
    Icon: Handshake,
    label: 'Take on Rent',
    metric: 20,
  },
];
