import { Header, HeaderTitle } from 'app/components/header';
import SearchBar from 'app/components/searchbar';
import { Button } from 'app/components/ui/button';
import { SearchBarWithQuery } from 'app/components2/molecules/searchbar-with-query';
import { useColorScheme } from 'app/hooks/color-scheme';
import { ArrowLeft, SearchIcon } from 'lucide-react-native';
import { useState } from 'react';
import { View } from 'react-native';

export function ChatScreenHeader() {
  const { colors } = useColorScheme();
  const [searchMode, setSearchMode] = useState(false);

  return (
    <Header>
      {searchMode ? (
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
      ) : (
        <View className="flex-row justify-between items-center w-full">
          <HeaderTitle>Chat</HeaderTitle>
          <Button
            variant={'ghost'}
            size={'icon'}
            onPress={() => setSearchMode(true)}
          >
            <SearchIcon color={colors.subtext} size={18} />
          </Button>
        </View>
      )}
    </Header>
  );
}
