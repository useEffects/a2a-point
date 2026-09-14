import { Header, HeaderTitle } from 'app/components/header';
import { Button } from 'app/components/ui/button';
import { GoToPostButton } from 'app/components/utils/common-ui';
import { SearchBarWithQuery } from 'app/components2/molecules/searchbar-with-query';
import { useColorScheme } from 'app/hooks/color-scheme';
import { ArrowLeft, ListFilter, Search } from 'lucide-react-native';
import { useState } from 'react';
import { View } from 'react-native';
import { ListingsFilterTemplate } from './filters';
import BottomSheet from 'app/components/bottomsheet';

export const ListingsHeader = () => {
  const { colors } = useColorScheme();
  const [searchMode, setSearchMode] = useState(false);

  return (
    <Header>
      <View className="flex-row justify-between flex-1 items-center">
        {searchMode ? (
          <>
            <SearchBarWithQuery
              searchBarProps={{
                searchIcon: (
                  <Button
                    variant={'base'}
                    size={'icon'}
                    onPress={() => setSearchMode(false)}
                  >
                    <ArrowLeft color={colors.subtext} size={18} />
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
              <ListingsFilterButton />
              <GoToPostButton />
            </View>
          </>
        )}
      </View>
    </Header>
  );
};

const ListingsFilterButton = () => {
  const { colors } = useColorScheme();
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button variant={'ghost'} size={'icon'} onPress={() => setOpen(true)}>
        <ListFilter
          color={open ? colors.foreground : colors.subtext}
          size={18}
        />
      </Button>
      <BottomSheet
        open={open}
        setOpen={setOpen}
        onBackdropPress={() => setOpen(false)}
      >
        <ListingsFilterTemplate onClose={() => setOpen(false)} />
      </BottomSheet>
    </>
  );
};
