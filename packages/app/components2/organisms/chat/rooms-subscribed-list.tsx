import { useAuthFlow } from 'app/application/auth/hooks';
import { createRoomsSubscribedQOpts } from 'app/application/chat/queries';
import { Button } from 'app/components/ui/button';
import { Text } from 'app/components/ui/text';
import { CardList } from 'app/components2/molecules/card-list/card-list';
import {
  ChatListRow,
  ChatListRowSkeleton,
} from 'app/components2/molecules/chat/chat-list-row';
import userStore from 'app/store/user';
import { useState } from 'react';
import { View } from 'react-native';

export const RoomsSubcribed = () => {
  const [activePill, setActivePill] = useState(filterPills[0]!);
  const { user } = userStore();
  const {
    data: { isAuthenticated },
  } = useAuthFlow();

  const queryOptions = createRoomsSubscribedQOpts({
    query: {
      filter: {
        members: {
          directus_users_id: {
            _eq: user.id,
          },
        },
        type:
          activePill === 'DM'
            ? 'dm'
            : activePill === 'Group'
              ? 'group'
              : undefined,
      },
    },
    queryOptions: {
      enabled: isAuthenticated,
    },
  });

  return (
    <View className="flex-col gap-4 flex-1">
      <View className="flex-row gap-4 px-4">
        {filterPills.map((pill) => (
          <Button
            key={pill}
            onPress={() => setActivePill(pill)}
            className="px-2"
            variant={activePill === pill ? 'secondary' : 'outline'}
            size={'none'}
          >
            <Text>{pill}</Text>
          </Button>
        ))}
      </View>
      <CardList
        infiniteQueryOptions={queryOptions}
        component={ChatListRow}
        skeletonComponent={ChatListRowSkeleton}
        flatListProps={{
          scrollEnabled: true,
        }}
      />
    </View>
  );
};

const filterPills = ['All', 'DM', 'Group'];
