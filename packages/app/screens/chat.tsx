import { readItems } from '@directus/sdk';
import { useQuery } from '@tanstack/react-query';
import ChatImgDark from 'app/assets/locked-screens/dark/chat.jpg';
import ChatImgLight from 'app/assets/locked-screens/light/chat.jpg';
import { Header } from 'app/components/header';
import SearchBar from 'app/components/searchbar';
import { Button } from 'app/components/ui/button';
import { Separator } from 'app/components/ui/separator';
import { Text } from 'app/components/ui/text';
import { FlatList } from 'app/components/utils/virtual-lists';
import { RoomSubscribed } from 'app/context/chats';
import { useChats } from 'app/hooks/chats';
import { useColorScheme } from 'app/hooks/color-scheme';
import { useRouter } from 'app/hooks/router';
import { buildAssetUrl, getDMRoomId, timeAgo } from 'app/lib/helpers';
import { renderCardsQuery } from 'app/lib/misc/queries';
import { Message, Room, User } from 'app/lib/types';
import { directusStore } from 'app/store/directus';
import userStore from 'app/store/user';
import { uniqBy } from 'lodash';
import { useEffect, useMemo, useState } from 'react';
import { Image, View } from 'react-native';
import {
  NavigationState,
  Route,
  SceneMap,
  TabView,
} from 'react-native-tab-view';
import { useDebounce } from 'use-debounce';
import LockedScreen from './locked-screens';
import { ChatMessage, withId, withUri } from 'app/components/chat-ui';
import { AsyncImage } from 'app/components/async-image';

export const ChatLocked = () => {
  const { isDarkColorScheme } = useColorScheme();
  return (
    <LockedScreen
      image={isDarkColorScheme ? ChatImgDark : ChatImgLight}
      headerTitle="Chat"
      title="Chat with other agents!"
      description="Gain access to seamless communication with other agents, real-time updates, and the ability to share property details and documents instantly."
    />
  );
};

export default function ChatScreen() {
  const { authenticated } = directusStore();

  return authenticated ? <ChatScreenComponent /> : <ChatLocked />;
}

function ChatScreenComponent() {
  const { rest } = directusStore();
  const [searchText, setSearchText] = useState('');
  const [debouncedSearchText] = useDebounce(searchText, 500);
  const { roomsSubscribed, messages } = useChats();
  const { user } = userStore();

  const { data: contacts } = useQuery({
    queryKey: ['Fetch Contacts', debouncedSearchText],
    queryFn: async () =>
      await renderCardsQuery<ContactListRowProp>({
        collection: 'users',
        filter: {
          id: {
            _neq: user.id,
          },
        },
        fields: ['id', 'first_name', 'last_name', 'avatar'],
        searchText: debouncedSearchText,
      }),
    enabled: debouncedSearchText.length > 0,
    initialData: [],
  });

  const { data: groups } = useQuery({
    queryKey: ['Fetch Rooms', debouncedSearchText],
    queryFn: async () =>
      await rest.request(
        readItems('rooms', {
          fields: ['id', 'avatar', 'title'],
          search: debouncedSearchText,
          filter: {
            type: {
              _eq: 'group',
            },
          },
        }),
      ),
    enabled: debouncedSearchText.length > 0,
    initialData: [],
  }) as { data: GroupListRowProp[]; isLoading: boolean };

  return (
    <View className="flex-col h-full">
      <Header>
        <Text className="text-xl font-bold">Chat</Text>
      </Header>
      <View className="p-4 bg-card">
        <SearchBar searchText={searchText} setSearchText={setSearchText} />
      </View>
      {contacts?.length || groups?.length ? (
        <View className="w-full">
          {contacts?.length ? (
            <View>
              <Text className="p-4 text-info">Contacts</Text>
              <FlatList
                data={uniqBy(contacts, 'id')}
                renderItem={({ item }) => <ContactListRow {...item} />}
              />
            </View>
          ) : (
            <></>
          )}
          {groups?.length ? (
            <View>
              <Text className="p-4 text-info">Groups</Text>
              <FlatList
                data={uniqBy(groups, 'id')}
                renderItem={({ item }) => <GroupListRow {...item} />}
              />
            </View>
          ) : (
            <></>
          )}
        </View>
      ) : (
        <ChatsTabView roomsSubscribed={roomsSubscribed} messages={messages} />
      )}
    </View>
  );
}

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

const ChatList = ({ data }: { data: RoomSubscribed[] }) => {
  return (
    <FlatList
      data={uniqBy(data, 'id')}
      renderItem={({ item }) => <ChatListRow {...item} />}
      ItemSeparatorComponent={() => <Separator />}
      bounces={false}
      overScrollMode="never"
    />
  );
};

const ChatListRow = (room: RoomSubscribed) => {
  const { user } = userStore();
  const { messages } = useChats();
  const router = useRouter();

  const lastMessage = messages.find((message) => message.room === room.id);
  let lastMessageContent = lastMessage?.content.trim();
  if (lastMessageContent === '') {
    lastMessageContent = `Attachment: ${lastMessage?.assets?.[0]!.name}`;
  }
  if (lastMessage?.user_created.id === user?.id) {
    lastMessageContent = `You: ${lastMessageContent}`;
  } else if (
    room.type === 'group' &&
    lastMessage?.user_created.id !== user?.id
  ) {
    lastMessageContent = `${lastMessage?.user_created.first_name}: ${lastMessageContent}`;
  }

  const receiver = room.members.find(
    (member) => member.directus_users_id.id !== user?.id,
  );

  const [roomName, roomAvatar] =
    room.type === 'group'
      ? [room.title, buildAssetUrl(room.avatar)]
      : [
          `${receiver!.directus_users_id.first_name} ${receiver!.directus_users_id.last_name}`,
          buildAssetUrl(receiver!.directus_users_id.avatar),
        ];

  return (
    <Button
      onPress={() => router.push(`/chat/${room.id}`)}
      variant={'ghost'}
      className="flex-row gap-4 items-center w-full justify-start !h-20"
    >
      <AsyncImage
        className="w-12 h-12 rounded-full"
        source={{ uri: roomAvatar }}
      />
      <View className="flex-col justify-center flex-1">
        <View className="flex-row justify-between items-center">
          <Text className="!text-base">{roomName}</Text>
          {lastMessage ? (
            <Text className="!text-sm text-subtext">
              {timeAgo.format(new Date(lastMessage.date_created))}
            </Text>
          ) : (
            <></>
          )}
        </View>
        {lastMessage ? (
          <Text className="!text-sm text-subtext !font-normal">
            {lastMessageContent}
          </Text>
        ) : (
          <></>
        )}
      </View>
    </Button>
  );
};

type ContactListRowProp = Pick<
  User,
  'avatar' | 'id' | 'first_name' | 'last_name'
>;
type GroupListRowProp = Pick<Room, 'avatar' | 'id' | 'type' | 'title'>;

const ContactListRow = (contact: ContactListRowProp) => {
  const { user } = userStore();
  const router = useRouter();
  return (
    <Button
      onPress={() =>
        getDMRoomId([contact.id, user.id]).then((id) =>
          router.push(`/chat/${id}`),
        )
      }
      variant={'ghost'}
      className="flex-row gap-4 items-center w-full justify-start !h-20"
    >
      <AsyncImage
        className="w-12 h-12 rounded-full"
        source={{ uri: buildAssetUrl(contact.avatar) }}
      />
      <Text className="!text-base">
        {contact.first_name} {contact.last_name}
      </Text>
    </Button>
  );
};

const GroupListRow = (group: GroupListRowProp) => {
  const router = useRouter();
  return (
    <Button
      variant={'ghost'}
      onPress={() => router.push(`/chat/${group.id}`)}
      className="flex-row gap-4 items-center w-full justify-start !h-20"
    >
      <AsyncImage
        className="w-12 h-12 rounded-full"
        source={{ uri: buildAssetUrl(group.avatar) }}
      />
      <Text className="!text-base">{group.title}</Text>
    </Button>
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

    console.log(lastMessageDateCreated(a), lastMessageDateCreated(b));

    const aDate = lastMessageDateCreated(a);
    const bDate = lastMessageDateCreated(b);
    if (!aDate || !bDate) return 0;
    else {
      return new Date(bDate).getTime() - new Date(aDate).getTime();
    }
  };
