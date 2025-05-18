import {
  SearchContext,
  SearchResults,
} from 'app/components2/molecules/search-results';
import { useContext, useEffect, useState } from 'react';
import {
  GroupListRow,
  GroupListRowSkeleton,
} from 'app/components2/molecules/chat/group-list-row';
import {
  ContactListRow,
  ContactListRowSkeleton,
} from 'app/components2/molecules/chat/contact-list-row';
import { Dimensions, View } from 'react-native';
import Collapsible from 'react-native-collapsible';
import { CardList } from 'app/components2/molecules/card-list/card-list';
import { createContactListQOpts, createGroupListQOpts } from './queries';
import { Text } from 'app/components/ui/text';
import { SeparatorText } from 'app/components/separator-text';

export const ChatSearchResults = () => {
  return (
    <View>
      <SearchResults>
        <SearchResults.SearchBar
          searchBarProps={{
            containerStyle: { paddingHorizontal: 16, paddingTop: 16 },
          }}
        />
        <ResultsWrapped />
      </SearchResults>
    </View>
  );
};

const ResultsWrapped = () => {
  const { searchText } = useContext(SearchContext);
  const [open, setOpen] = useState(false);
  const { height: windowHeight } = Dimensions.get('window');

  useEffect(() => {
    if (searchText && !open) setOpen(true);
    else if (!searchText && open) setOpen(false);
  }, [searchText]);

  return (
    <Collapsible collapsed={!open} collapsedHeight={0}>
      <View className="flex-col gap-4 p-4 pt-0">
        <View
          className="bg-card rounded p-4"
          style={{ maxHeight: windowHeight / 4 }}
        >
          <SearchResults.Results>
            {({ debouncedSearchText }) => (
              <CardList
                queryOptions={createContactListQOpts(debouncedSearchText)}
                component={ContactListRow}
                skeletonComponent={ContactListRowSkeleton}
                flatListProps={{
                  ListHeaderComponent: () => (
                    <SeparatorText hideLeft>
                      <Text>Contacts</Text>
                    </SeparatorText>
                  ),
                  showsVerticalScrollIndicator: false,
                }}
              />
            )}
          </SearchResults.Results>
        </View>
        <View
          className="bg-card rounded p-4"
          style={{ maxHeight: windowHeight / 4 }}
        >
          <SearchResults.Results>
            {({ debouncedSearchText }) => (
              <CardList
                queryOptions={createGroupListQOpts(debouncedSearchText)}
                component={GroupListRow}
                skeletonComponent={GroupListRowSkeleton}
                flatListProps={{
                  ListHeaderComponent: () => (
                    <SeparatorText hideLeft>
                      <Text>Groups</Text>
                    </SeparatorText>
                  ),
                  showsVerticalScrollIndicator: false,
                }}
              />
            )}
          </SearchResults.Results>
        </View>
      </View>
    </Collapsible>
  );
};
