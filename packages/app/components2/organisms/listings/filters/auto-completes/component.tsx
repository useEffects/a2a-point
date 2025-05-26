import { Text } from 'app/components/ui/text';
import { useColorScheme } from 'app/hooks/color-scheme';
import { View } from 'react-native';
import { SearchLocations } from './search-locations';
import { Search } from 'lucide-react-native';
import { FiltersProvider } from '../context';

export const ListingsFiltersAutoCompletes = () => {
  return (
    <View className="flex-col gap-4 py-4">
      <Text className="text-lg">Search</Text>
      <SearchLocations />
    </View>
  );
};
