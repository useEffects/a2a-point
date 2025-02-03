import { MediumLocationCard } from 'app/components/cards/molecules/locations';
import {
  getMediumLocationQueryArgs,
  mediumLocationCardsQuery,
} from 'app/components/cards/molecules2/locations';
import { BackButton, Header, HeaderTitle } from 'app/components/header';
import InfiniteList from 'app/components/infinite';
import SearchBar from 'app/components/searchbar';
import { Separator } from 'app/components/ui/separator';
import { Text } from 'app/components/ui/text';
import { LocationCardMetrics, MediumLocationCardProps } from 'app/lib/props';
import { useState } from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useDebounce } from 'use-debounce';

export const LocationsList = ({
  data,
}: {
  data: (MediumLocationCardProps & LocationCardMetrics)[];
}) => {
  const [searchText, setSearchText] = useState('');
  const [debouncedSearchText] = useDebounce(searchText, 500);
  const queryFnArgs = getMediumLocationQueryArgs({
    search: debouncedSearchText,
  });

  return (
    <View className="flex-1">
      <View className="p-4">
        <SearchBar searchText={searchText} setSearchText={setSearchText} />
      </View>
      <View className="flex-1 max-w-xl">
        <InfiniteList<MediumLocationCardProps & LocationCardMetrics>
          component={(item) => <MediumLocationCard item={item} />}
          initialItems={data}
          queryFn={mediumLocationCardsQuery}
          queryKey={['locations list', queryFnArgs]}
          queryFnArgs={queryFnArgs}
          infinite
          flatListProps={{
            contentContainerClassName: 'px-4 flex-grow max-w-xl',
            ItemSeparatorComponent: () => <Separator className="my-4" />,
            scrollEnabled: false,
          }}
        />
      </View>
    </View>
  );
};

export function LocationsListScreenHeader() {
  const { top } = useSafeAreaInsets();
  return (
    <Header height={'auto'}>
      <View
        className="flex-row items-center pb-4"
        style={{ paddingTop: top + 16 }}
      >
        <View className="h-12 flex-row items-center gap-4">
          <BackButton />
          <HeaderTitle>Locations</HeaderTitle>
        </View>
      </View>
    </Header>
  );
}
