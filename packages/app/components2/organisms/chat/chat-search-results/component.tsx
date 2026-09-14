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
import { useGlobalSearchParams } from 'app/context/router';
import { SeparatorText } from 'app/components/separator-text';
import { Text } from 'app/components/ui/text';

export const ChatSearchResults = () => {
  const [open, setOpen] = useState(false);
  const { height: windowHeight } = Dimensions.get('window');
  const { searchText } = useGlobalSearchParams();

  useEffect(() => {
    if (searchText && !open) setOpen(true);
    else if (!searchText && open) setOpen(false);
  }, [searchText]);

  return (
    <Collapsible collapsed={!open} collapsedHeight={0}>
      <View className="flex-col gap-4 p-4">
        <SeparatorText hideLeft>
          <Text>Contacts</Text>
        </SeparatorText>
        <View
          className="bg-card rounded border border-solid border-border"
          style={{ maxHeight: windowHeight / 4 }}
        >
          <CardList
            queryOptions={createContactListQOpts((searchText as string) ?? '')}
            component={ContactListRow}
            skeletonComponent={ContactListRowSkeleton}
            noMoreClassName="h-8 items-start p-4"
          />
        </View>
        <SeparatorText hideLeft>
          <Text>Groups</Text>
        </SeparatorText>
        <View
          className="bg-card rounded border border-solid border-border"
          style={{ maxHeight: windowHeight / 4 }}
        >
          <CardList
            queryOptions={createGroupListQOpts((searchText as string) ?? '')}
            component={GroupListRow}
            skeletonComponent={GroupListRowSkeleton}
            noMoreClassName="h-8 items-start p-4"
          />
        </View>
      </View>
    </Collapsible>
  );
};
