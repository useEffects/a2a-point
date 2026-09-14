// Searchbar component that updates the URL Search Param of the page by its input value.

import SearchBar from 'app/components/searchbar';
import { useGlobalSearchParams, useRouter } from 'app/context/router';
import { ComponentProps, useEffect, useState } from 'react';

export const SearchBarWithQuery = ({
  queryName = 'searchText',
  searchBarProps,
}: { queryName?: string } & Pick<
  ComponentProps<typeof SearchBar>,
  'searchBarProps'
>) => {
  const [searchText, setSearchText] = useState('');
  const router = useRouter();
  const params = useGlobalSearchParams();

  useEffect(() => {
    if (params?.[queryName]) setSearchText(params[queryName] as string);

    return () => {
      setSearchText('');
      router.setParams({ [queryName]: '' });
    };
  }, []);

  useEffect(() => {
    if (searchText) router.setParams({ [queryName]: searchText });
  }, [searchText, router.setParams]);

  return (
    <SearchBar
      searchText={searchText}
      setSearchText={setSearchText}
      searchBarProps={searchBarProps}
    />
  );
};
