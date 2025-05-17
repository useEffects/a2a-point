import { Button } from 'app/components/ui/button';
import { Separator } from 'app/components/ui/separator';
import { Text } from 'app/components/ui/text';
import { FlatList } from 'app/components/utils/virtual-lists';
import { RoomSubscribed } from 'app/context/chats';
import { useChats } from 'app/hooks/chats';
import { useRouter } from 'app/hooks/router';
import { buildAssetUrl, timeAgo } from 'app/lib/helpers';
import userStore from 'app/store/user';
import { uniqBy } from 'lodash';
import { useMemo, useState } from 'react';
import { View } from 'react-native';
import {
  NavigationState,
  Route,
  SceneMap,
  TabView,
} from 'react-native-tab-view';
import { ChatMessage, withId, withUri } from 'app/components/chat-ui';
import { AsyncImage } from 'app/components/async-image';

export const ChatScreenTemplate = () => {};

const ChatsTabView = ({
  roomsSubscribed,
  messages,
}: {
  roomsSubscribed: RoomSubscribed[];
  messages: ChatMessage<withId | withUri>[];
}) => {
  const routes = [
    { key: 'all', title: 'All' },
    { key: 'dm', title: 'DM' },
    { key: 'groups', title: 'Groups' },
  ];
  const [navigationState, setNavigationState] = useState<
    NavigationState<Route>
  >({
    index: 0,
    routes: routes,
  });

  const sortedRoomsSubscribed = useMemo(() => {
    const sortFunction = sortChatRooms(messages);
    return roomsSubscribed.sort(sortFunction);
  }, [roomsSubscribed, messages]);

  const dms = useMemo(
    () => sortedRoomsSubscribed.filter((room) => room.type === 'dm'),
    [sortedRoomsSubscribed],
  );
  const groups = useMemo(
    () => sortedRoomsSubscribed.filter((room) => room.type === 'group'),
    [sortedRoomsSubscribed],
  );

  return (
    <TabView
      navigationState={navigationState}
      renderTabBar={() => (
        <View className="w-full flex-row gap-4 items-center p-4">
          {routes.map(({ title }, index) => (
            <Button
              key={index}
              variant={index === navigationState.index ? 'default' : 'outline'}
              size={'sm'}
              className="rounded-full"
              onPress={() => setNavigationState((p) => ({ ...p, index }))}
            >
              <Text>{title}</Text>
            </Button>
          ))}
        </View>
      )}
      renderScene={SceneMap({
        all: () => <ChatList data={sortedRoomsSubscribed} />,
        dm: () => <ChatList data={dms} />,
        groups: () => <ChatList data={groups} />,
      })}
      onIndexChange={(index) =>
        setNavigationState({ ...navigationState, index })
      }
    />
  );
};


const sortChatRooms =
  (messages: ChatMessage<withId | withUri>[]) =>
  (a: RoomSubscribed, b: RoomSubscribed) => {
    const lastMessageDateCreated = (room: RoomSubscribed) =>
      messages
        .filter((message) => message.room === room.id)
        .sort(
          (a, b) =>
            new Date(b.date_created).getTime() -
            new Date(a.date_created).getTime(),
        )[0]?.date_created;

    const aDate = lastMessageDateCreated(a);
    const bDate = lastMessageDateCreated(b);
    if (!aDate || !bDate) return 0;
    else {
      return new Date(bDate).getTime() - new Date(aDate).getTime();
    }
  };
