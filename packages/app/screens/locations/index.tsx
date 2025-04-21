import {
  MediumLocationCard,
  MediumLocationCardSkeleton,
} from 'app/components/cards/molecules/locations';
import { getMediumLocationQueryArgs } from 'app/components/cards/molecules2/locations';
import { BackButton, Header, HeaderTitle } from 'app/components/header';
import InfiniteList from 'app/components/infinite';
import SearchBar from 'app/components/searchbar';
import { Separator } from 'app/components/ui/separator';
import { Text } from 'app/components/ui/text';
import { LocationCardMetrics, MediumLocationCardProps } from 'app/lib/props';
import { useMemo, useState } from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useDebounce } from 'use-debounce';
import { mediumLocationsCardQuery } from './queries';
import { useColorScheme } from 'app/hooks/color-scheme';

export const LocationsList = ({
  data,
}: {
  data: (MediumLocationCardProps & LocationCardMetrics)[];
}) => {
  const [searchText, setSearchText] = useState('');
  const [debouncedSearchText] = useDebounce(searchText, 500);
  const mediumLocationCardsQueryOptions = useMemo(
    () => mediumLocationsCardQuery({ search: debouncedSearchText }),
    [debouncedSearchText],
  );
  const { colors } = useColorScheme();

  return (
    <View className="flex-1">
      <View className="px-4 bg-accent">
        <SearchBar
          searchText={searchText}
          setSearchText={setSearchText}
          searchBarProps={{
            inputContainerStyle: { backgroundColor: colors.background },
          }}
        />
        <Separator className="mt-4" />
      </View>
      <View className="flex-1 max-w-xl">
        <InfiniteList<MediumLocationCardProps & LocationCardMetrics>
          component={MediumLocationCard}
          skeletonComponent={MediumLocationCardSkeleton}
          infinite
          flatListProps={{
            contentContainerClassName: 'p-4 flex-grow max-w-xl',
            ItemSeparatorComponent: () => <Separator className="my-4" />,
            scrollEnabled: false,
          }}
          infiniteQueryOptions={mediumLocationCardsQueryOptions}
        />
      </View>
    </View>
  );
};

export function LocationsListScreenHeader() {
  return (
    <Header>
      <View className="flex-row items-center gap-4">
        <BackButton />
        <HeaderTitle>Locations</HeaderTitle>
      </View>
    </Header>
  );
}
