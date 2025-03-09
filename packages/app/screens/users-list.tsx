import { MediumUsersCard } from 'app/components/cards/atoms/users';
import {
  getMediumUsersCardArgs,
  mediumUsersCardsQuery,
} from 'app/components/cards/molecules2/agents';
import {
  BackButton,
  Header,
  HeaderTitle,
} from 'app/components/header';
import InfiniteList from 'app/components/infinite';
import SearchBar from 'app/components/searchbar';
import { Separator } from 'app/components/ui/separator';
import { MediumUsersCardProps, UsersCardMetrics } from 'app/lib/props';
import { useState } from 'react';
import { View } from 'react-native';
import { useDebounce } from 'use-debounce';

export const UsersListScreen = ({
  data,
}: {
  data: (MediumUsersCardProps & UsersCardMetrics)[];
}) => {
  const [searchText, setSearchText] = useState('');
  const [debouncedSearchText] = useDebounce(searchText, 500);
  const queryArgs = getMediumUsersCardArgs({
    search: debouncedSearchText,
  });

  return (
    <View className="flex-1 flex-col justify-start">
      <View className="p-4 py-4">
        <SearchBar searchText={searchText} setSearchText={setSearchText} />
      </View>
      <InfiniteList<MediumUsersCardProps & UsersCardMetrics>
        initialItems={data}
        component={(item) => <MediumUsersCard {...item} />}
        queryFn={mediumUsersCardsQuery}
        queryKey={['users list', queryArgs]}
        queryFnArgs={queryArgs}
        infinite
        flatListProps={{
          ItemSeparatorComponent: () => <Separator className="my-8" />,
          contentContainerClassName: 'p-4 max-w-xl',
          showsVerticalScrollIndicator: true,
        }}
      />
    </View>
  );
};

export function UsersListScreenHeader() {
  return (
    <Header>
      <View className="flex-row items-center gap-4">
        <BackButton />
        <HeaderTitle>Agents</HeaderTitle>
      </View>
    </Header>
  );
}
