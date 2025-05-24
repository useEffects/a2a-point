import { Button } from 'app/components/ui/button';
import { Text } from 'app/components/ui/text';
import { ListingsFiltersAutoCompletes } from 'app/components2/organisms/listings/filters/auto-completes/component';
import { useColorScheme } from 'app/hooks/color-scheme';
import { X } from 'lucide-react-native';
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
    <View
      className="bg-accent p-4 flex-col gap-8"
      style={{ paddingBottom: safeAreaBottom }}
    >
      <View className="flex-row items-center justify-between">
        <Text>Filter Leads</Text>
        <Button variant={'destructive'} size={'smallIcon'} onPress={onClose}>
          <X color={colors['destructive-foreground']} size={18} />
        </Button>
      </View>
      <ListingsFiltersAutoCompletes />
    </View>
  );
};
