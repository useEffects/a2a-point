import { Button } from 'app/components/ui/button';
import { Text } from 'app/components/ui/text';
import { useContext } from 'react';
import { FiltersContext } from './context';
import { useRouter } from 'app/context/router';
import { View } from 'react-native';

export const ApplyButton = () => {
  const { filters } = useContext(FiltersContext);
  const router = useRouter();

  const onPress = () => {
    router.setParams({ filters: JSON.stringify(filters) });
  };

  const noFiltersChosen = Object.keys(filters).length === 0;

  return (
    <View className="flex-row items-center gap-4">
      <Button
        variant="destructive"
        className="flex-1"
        disabled={noFiltersChosen}
      >
        <Text>Clear All</Text>
      </Button>
      <Button onPress={onPress} disabled={noFiltersChosen} className="flex-1">
        <Text>Apply Filters</Text>
      </Button>
    </View>
  );
};
