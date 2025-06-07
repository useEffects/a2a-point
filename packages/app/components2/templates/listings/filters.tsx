import { Button } from 'app/components/ui/button';
import { Separator } from 'app/components/ui/separator';
import { Text } from 'app/components/ui/text';
import { TabBar } from 'app/components2/molecules/tabbar';
import { ApplyButton } from 'app/components2/organisms/listings/filters/apply-button';
import { ListingsFiltersAutoCompletes } from 'app/components2/organisms/listings/filters/auto-completes/component';
import { FiltersProvider } from 'app/components2/organisms/listings/filters/context';
import { RangeSelectors } from 'app/components2/organisms/listings/filters/range-selectors/component';
import { SelectPurpose } from 'app/components2/organisms/listings/filters/select-purpose/component';
import { useColorScheme } from 'app/hooks/color-scheme';
import { directusUrl } from 'app/lib/constants';
import { Link } from 'expo-router';
import { X } from 'lucide-react-native';
import { useState } from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SceneMap, TabView } from 'react-native-tab-view';

export const ListingsFilterTemplate = ({
  onClose,
}: {
  onClose: () => void;
}) => {
  const { colors } = useColorScheme();
  const { bottom: safeAreaBottom } = useSafeAreaInsets();
  const [index, setIndex] = useState(0);

  return (
    <FiltersProvider>
      <View
        className="bg-background p-4 flex-col gap-4"
        style={{ paddingBottom: safeAreaBottom }}
      >
        <View className="flex-row items-center justify-between">
          <Text className="text-xl font-semibold">Filter Leads</Text>
          <Button variant={'destructive'} size={'smallIcon'} onPress={onClose}>
            <X color={colors['destructive-foreground']} size={18} />
          </Button>
        </View>
        <TabView
          style={{ height: 400 }}
          renderScene={renderScene}
          navigationState={{ index, routes }}
          onIndexChange={setIndex}
          renderTabBar={FiltersTabBar}
        />
        <Text>
          Find more powerful filters on the A2A Point{' '}
          <Link
            className="underline text-info"
            href={`${directusUrl}/admin/listings`}
          >
            dashboard!
          </Link>
        </Text>
        <View className="flex-col gap-4">
          <Separator />
          <ApplyButton />
        </View>
      </View>
    </FiltersProvider>
  );
};

const routes = [
  { key: '1', title: '1' },
  { key: '2', title: '2' },
];

const FiltersTabBar = TabBar(routes);

const FirstFiltersPage = () => {
  return (
    <View className="flex-col gap-4 flex-1 py-4">
      <ListingsFiltersAutoCompletes />
      <SelectPurpose />
    </View>
  );
};

const SecondFiltersPage = () => {
  return (
    <View className="flex-col flex-1 py-4">
      <RangeSelectors />
    </View>
  );
};

const renderScene = SceneMap({
  '1': FirstFiltersPage,
  '2': SecondFiltersPage,
});
