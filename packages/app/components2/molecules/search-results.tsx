import {
  createContext,
  useContext,
  useState,
  ReactNode,
  Dispatch,
  SetStateAction,
  FC,
  useEffect,
} from 'react';
import SearchBarBase from 'app/components/searchbar';
import { useDebounce } from 'use-debounce';
import { UseQueryOptions } from '@tanstack/react-query';
import { CardList } from './card-list/card-list';
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

SearchResults.Results = function Results({
  children,
}: {
  children: (props: { debouncedSearchText: string }) => ReactNode;
}) {
  const { searchText } = useContext(SearchContext);
  const [debouncedSearchText] = useDebounce(searchText, 500);

  return children({ debouncedSearchText });
};
