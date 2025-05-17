import {
  SearchContext,
  SearchResults,
} from 'app/components2/molecules/search-results';
import BottomSheet from 'app/components/bottomsheet';
import { useContext, useEffect, useState } from 'react';
import {
  GroupListRow,
  GroupListRowSkeleton,
} from 'app/components2/molecules/chat/group-list-row';
import {
  ContactListRow,
  ContactListRowSkeleton,
} from 'app/components2/molecules/chat/contact-list-row';
import { View } from 'react-native';

export const ChatSearchResults = () => {
  return (
    <SearchResults>
      <SearchResults.SearchBar />
      <ResultsWrapped />
    </SearchResults>
  );
};

const ResultsWrapped = () => {
  const { searchText } = useContext(SearchContext);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (searchText) setOpen(true);
  }, [searchText]);

  return (
    <BottomSheet
      open={open}
      setOpen={setOpen}
      onBackdropPress={() => setOpen(false)}
    >
      <View className="flex-col gap-4">
        <SearchResults.Results
          query={{ collection: 'messages' }}
          component={ContactListRow}
          skeletonComponent={ContactListRowSkeleton}
        />
        <SearchResults.Results
          query={{ collection: 'rooms' }}
          component={GroupListRow}
          skeletonComponent={GroupListRowSkeleton}
        />
      </View>
    </BottomSheet>
  );
};
