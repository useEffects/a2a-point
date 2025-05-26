import { Button } from 'app/components/ui/button';
import { Separator } from 'app/components/ui/separator';
import { Text } from 'app/components/ui/text';
import { ApplyButton } from 'app/components2/organisms/listings/filters/apply-button';
import { ListingsFiltersAutoCompletes } from 'app/components2/organisms/listings/filters/auto-completes/component';
import { FiltersProvider } from 'app/components2/organisms/listings/filters/context';
import { RangeSelectors } from 'app/components2/organisms/listings/filters/range-selectors/component';
import { SelectPurpose } from 'app/components2/organisms/listings/filters/select-purpose/component';
import { useColorScheme } from 'app/hooks/color-scheme';
import { Apple, X } from 'lucide-react-native';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export const ListingsFilterTemplate = ({
  onClose,
}: {
  onClose: () => void;
}) => {
  const { colors } = useColorScheme();
  const { bottom: safeAreaBottom } = useSafeAreaInsets();

  return (
    <FiltersProvider>
      <View
        className="bg-background p-4 flex-col gap-4"
        style={{ paddingBottom: safeAreaBottom }}
      >
        <View className="flex-row items-center justify-between">
          <Text className="text-lg font-medium">Filter Leads</Text>
          <Button variant={'destructive'} size={'smallIcon'} onPress={onClose}>
            <X color={colors['destructive-foreground']} size={18} />
          </Button>
        </View>
        <ListingsFiltersAutoCompletes />
        <SelectPurpose />
        <RangeSelectors />
        <View className="flex-col gap-4">
          <Separator />
          <ApplyButton />
        </View>
      </View>
    </FiltersProvider>
  );
};
