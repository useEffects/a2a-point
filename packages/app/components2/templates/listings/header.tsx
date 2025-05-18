import { Header, HeaderTitle } from 'app/components/header';
import SearchBar from 'app/components/searchbar';
import { Button } from 'app/components/ui/button';
import { GoToPostButton } from 'app/components/utils/common-ui';
import { useGlobalSearchParams, useRouter } from 'app/context/router';
import { useColorScheme } from 'app/hooks/color-scheme';
import { ArrowLeft, ListFilter, Search } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { View } from 'react-native';
import { useDebounce } from 'use-debounce';

export const ListingsHeader = () => {
  const { colors } = useColorScheme();
  const [searchMode, setSearchMode] = useState(false);
  const params = useGlobalSearchParams();
  const router = useRouter();
  const [searchText, setSearchText] = useState(
    (params?.searchText as string) ?? '',
  );

  useEffect(() => {
    router.setParams({ searchText });
  }, [searchText]);

  return (
    <Header>
      <View className="flex-row justify-between flex-1 items-center">
        {searchMode ? (
          <>
            <SearchBar
              searchText={searchText}
              setSearchText={setSearchText}
              searchBarProps={{
                searchIcon: (
                  <Button
                    variant={'base'}
                    size={'icon'}
                    onPress={() => setSearchMode(false)}
                  >
                    <ArrowLeft color={colors.secondary} size={18} />
                  </Button>
                ),
              }}
            />
          </>
        ) : (
          <>
            <HeaderTitle>Listings</HeaderTitle>
            <View className="flex-row items-center gap-1">
              <Button
                variant={'ghost'}
                size={'icon'}
                onPress={() => setSearchMode(true)}
              >
                <Search color={colors.secondary} size={18} />
              </Button>
              <Button variant={'ghost'} size={'icon'}>
                <ListFilter color={colors.secondary} size={18} />
              </Button>
              <GoToPostButton />
            </View>
          </>
        )}
      </View>
    </Header>
  );
};
