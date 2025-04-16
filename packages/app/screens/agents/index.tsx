import {
  MediumUsersCard,
  MediumUsersCardSkeleton,
} from 'app/components/cards/atoms/users';
import { getMediumUsersCardArgs } from 'app/components/cards/molecules2/agents';
import { BackButton, Header, HeaderTitle } from 'app/components/header';
import InfiniteList from 'app/components/infinite';
import SearchBar from 'app/components/searchbar';
import { Separator } from 'app/components/ui/separator';
import { MediumUsersCardProps, UsersCardMetrics } from 'app/lib/props';
import { useMemo, useState } from 'react';
import { View } from 'react-native';
import { useDebounce } from 'use-debounce';
import { mediumUsersQuery } from './queries';
import { useColorScheme } from 'app/hooks/color-scheme';

export const UsersListScreen = ({
  data,
}: {
  data: (MediumUsersCardProps & UsersCardMetrics)[];
}) => {
  const [searchText, setSearchText] = useState('');
  const [debouncedSearchText] = useDebounce(searchText, 500);
  const mediumUsersCardsQueryOptions = useMemo(
    () => mediumUsersQuery({ search: debouncedSearchText }),
    [debouncedSearchText],
  );
  const { colors } = useColorScheme();

  return (
    <View className="flex-1 flex-col justify-start bg-accent">
      <View className="px-4 pb-4 bg-accent">
        <SearchBar
          searchText={searchText}
          setSearchText={setSearchText}
          searchBarProps={{
            inputContainerStyle: {
              backgroundColor: colors.background,
            },
          }}
        />
      </View>
      <InfiniteList<MediumUsersCardProps & UsersCardMetrics>
        component={(item) => <MediumUsersCard {...item} />}
        infiniteQueryOptions={mediumUsersCardsQueryOptions}
        skeletonComponent={MediumUsersCardSkeleton}
        infinite
        flatListProps={{
          ItemSeparatorComponent: () => <Separator className="my-4" />,
          contentContainerClassName: 'p-4 max-w-xl',
          contentContainerStyle: {
            paddingHorizontal: 16,
            paddingVertical: 32,
            backgroundColor: colors.background,
            flex: 1,
          },
          showsVerticalScrollIndicator: true,
          scrollEnabled: false,
        }}
      />
    </View>
  );
};

export function UsersListScreenHeader() {
  return (
    <Header hideSeparator>
      <View className="flex-row items-center gap-4">
        <BackButton />
        <HeaderTitle>Agents</HeaderTitle>
      </View>
    </Header>
  );
}
