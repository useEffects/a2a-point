import {
  createContext,
  useContext,
  useState,
  ReactNode,
  Dispatch,
  SetStateAction,
  FC,
} from 'react';
import SearchBarBase from 'app/components/searchbar';
import { useDebounce } from 'use-debounce';
import { UseQueryOptions } from '@tanstack/react-query';
import { CardList } from './card-list/card-list';
import { Query } from '@directus/sdk';
import { renderCardsQuery2 } from 'app/lib/misc/queries';
import { SearchBarProps } from '@rneui/base';
import { FlatListProps } from 'react-native';

type SearchContextType = {
  searchText: string;
  setSearchText: Dispatch<SetStateAction<string>>;
};

export const SearchContext = createContext<SearchContextType>({
  searchText: '',
  setSearchText: () => {},
});

export const SearchResults = ({ children }: { children: ReactNode }) => {
  const [searchText, setSearchText] = useState('');

  return (
    <SearchContext.Provider value={{ searchText, setSearchText }}>
      {children}
    </SearchContext.Provider>
  );
};

SearchResults.SearchBar = function SearchBar({
  searchBarProps = {},
}: {
  searchBarProps?: SearchBarProps;
}) {
  const { searchText, setSearchText } = useContext(SearchContext);

  return (
    <SearchBarBase
      searchText={searchText}
      setSearchText={setSearchText}
      searchBarProps={searchBarProps}
    />
  );
};

SearchResults.Results = function Results<
  T extends JSX.IntrinsicAttributes & { id: string },
>({
  query,
  component,
  skeletonComponent,
  flatListProps = {},
}: {
  query: Query<any, T> & { collection: string };
  component: FC<T>;
  skeletonComponent: FC<{}>;
  flatListProps?: Omit<FlatListProps<T>, 'data' | 'renderItem'>;
}) {
  const { searchText } = useContext(SearchContext);
  const [debouncedSearchText] = useDebounce(searchText, 500);

  const queryOptions = {
    queryKey: [
      'Fetching searchable results',
      query.collection,
      debouncedSearchText,
    ],
    queryFn: async () =>
      renderCardsQuery2<T>({ ...query, search: debouncedSearchText }),
    initialData: [],
  } as UseQueryOptions<T[]>;

  return (
    <CardList
      component={component}
      skeletonComponent={skeletonComponent}
      flatListProps={{
        scrollEnabled: false,
        ...flatListProps,
      }}
      queryOptions={queryOptions}
    />
  );
};
