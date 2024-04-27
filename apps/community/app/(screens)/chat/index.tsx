import { createItem, readItems } from "@directus/sdk";
import { SearchBar } from "@rneui/themed";
import { useQuery } from "@tanstack/react-query";
import { router, useNavigation } from "expo-router";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Image, View } from "react-native";
import { FlatList } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useDebounce } from "use-debounce";
import { Button } from "~/components/ui/button";
import { Separator } from "~/components/ui/separator";
import { Text } from "~/components/ui/text";
import { queryClient } from "~/index";
import { directusUrl } from "~/lib/constants";
import { buildAssetUrl, getDMRoomId, searchBarContainerStyle, searchBarInputContainerStyle, shortString, timeAgo } from "~/lib/helpers";
import { useColorScheme } from "~/lib/useColorScheme";
import directusStore from "~/store/directus";
import userStore from "~/store/user";
import { Message, Room, User } from "~/types";

type ChatListRowProp = Pick<Room, "avatar" | "id" | "type" | "title"> & {
  members: { directus_users_id: Pick<User, "avatar" | "first_name" | "last_name" | "id"> }[];
};

type ContactListRowProp = Pick<User, "avatar" | "id" | "first_name" | "last_name">
type GroupListRowProp = Pick<Room, "avatar" | "id" | "type" | "title">

const ContactListRow = (contact: ContactListRowProp) => {
  const { user } = userStore()

  const handlePress = async () => {
    const roomId = await getDMRoomId([user!.id, contact.id])
    router.push(`/chat/${roomId}`)
  }

  return <Button variant={"ghost"}
    style={{ height: 72, padding: 0, borderRadius: 0 }}
    onPress={handlePress}
    className="flex-row gap-4 items-center w-full justify-start">
    <Image className="w-12 h-12 rounded-full" source={{ uri: buildAssetUrl(contact.avatar) }} />
    <Text className="!text-base">{contact.first_name} {contact.last_name}</Text>
  </Button>
}

const GroupListRow = (group: GroupListRowProp) => {
  const { rest } = directusStore()
  const { user } = userStore()
  const handlePress = async () => {
    await rest.request(createItem("rooms_directus_users", {
      directus_users_id: user.id,
      rooms_id: group.id
    }))
    router.push(`/chat/${group.id}`)
  }

  return <Button variant={"ghost"}
    style={{ height: 72, padding: 0, borderRadius: 0 }}
    onPress={handlePress}
    className="flex-row gap-4 items-center w-full justify-start">
    <Image className="w-12 h-12 rounded-full" source={{ uri: buildAssetUrl(group.avatar) }} />
    <Text className="!text-base">{group.title}</Text>
  </Button>
}

const ChatListRow = (room: ChatListRowProp) => {
  const { user } = userStore();
  const { rest } = directusStore()

  const receiver = room.members.find(
    (member) => member.directus_users_id.id !== user?.id,
  );
  const [roomName, roomAvatar] = room.type === "group"
    ? [room.title, buildAssetUrl(room.avatar)]
    : [
      `${receiver!.directus_users_id.first_name} ${receiver!.directus_users_id.last_name}`,
      buildAssetUrl(
        receiver!.directus_users_id.avatar,
      ),
    ];
  const { data: lastMessages, isLoading } = useQuery({
    queryKey: ["Fetch last sent message", room.id],
    queryFn: async () => await rest.request(readItems("messages", {
      filter: {
        room: {
          _eq: room.id,
        },
      },
      limit: 1,
      sort: ["-date_created"],
      fields: ["content", "date_created"],
    }))
  }) as { data: Pick<Message, "content" | "date_created">[], isLoading: boolean };

  const handlePress = () => {
    router.push(`/chat/${room.id}`)
  }

  const lastMessage = lastMessages?.length ? shortString(lastMessages[0].content, 100) || "Open chat to see attachment" : null;

  return (lastMessages && lastMessages.length > -1) ? (
    <Button variant={"ghost"}
      style={{ height: 72, padding: 0, borderRadius: 0 }}
      onPress={handlePress}
      className="flex-row gap-4 items-center w-full justify-start">
      <Image className="w-12 h-12 rounded-full" source={{ uri: roomAvatar }} />
      <View className="flex-col justify-center flex-1">
        <View className="flex-row justify-between items-center">
          <Text className="!text-base">{roomName}</Text>
          {lastMessages.length ? <Text className="!text-sm text-subtext">{timeAgo.format(new Date(lastMessages[0].date_created))}</Text> : <></>}
        </View>
        {lastMessage && <Text className="!text-sm text-subtext">{lastMessage.trim()}</Text>}
      </View>
    </Button>
  ) : <></>;
};

const ChatSearchBar = ({ searchText, setSearchText }: { searchText: string, setSearchText: Dispatch<SetStateAction<string>> }) => {
  const { colors } = useColorScheme()
  const insets = useSafeAreaInsets()
  return <View style={{ paddingTop: insets.top }}>
    <SearchBar
      placeholder="Search"
      containerStyle={searchBarContainerStyle}
      inputContainerStyle={{ ...searchBarInputContainerStyle, borderColor: colors.border, height: 36 }}
      inputStyle={{ fontSize: 14 }}
      value={searchText}
      onChangeText={setSearchText}
      cursorColor={colors.primary}
    />
  </View>
}

export default function ChatScreen() {
  const { rest, token } = directusStore()
  const { user } = userStore();
  const navigation = useNavigation();
  const [searchText, setSearchText] = useState("")
  const [debouncedSearchText] = useDebounce(searchText, 500)

  const { data: rooms, isLoading } = useQuery({
    queryKey: ["Fetch Chat Room"],
    queryFn: async () => await rest.request(readItems("rooms", {
      fields: ['id', 'avatar', 'type', 'title', 'members.directus_users_id.first_name', 'members.directus_users_id.last_name', 'members.directus_users_id.id', 'members.directus_users_id.avatar'
      ],
      filter: {
        members: {
          directus_users_id: {
            id: {
              _eq: user?.id,
            },
          },
        },
      },
    })),
    initialData: [],
    staleTime: 0,
  }) as { data: ChatListRowProp[], isLoading: boolean };

  const { data: contacts, isLoading: contactsLoading } = useQuery({
    queryKey: ["Fetch Contacts", debouncedSearchText],
    queryFn: async () => await fetch(`${directusUrl}/users/?fields=${["id", "first_name", "last_name", "avatar"].join(",")}&search=${encodeURIComponent(debouncedSearchText)}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }).then((res) => res.json()).then((res) => res.data),
    enabled: debouncedSearchText.length > 0,
    initialData: []
  })

  const { data: groups, isLoading: roomsLoading } = useQuery({
    queryKey: ["Fetch Rooms", debouncedSearchText],
    queryFn: async () => await rest.request(readItems("rooms", {
      fields: ['id', 'avatar', 'title'],
      search: debouncedSearchText,
      filter: {
        type: {
          _eq: "group"
        }
      }
    })),
    enabled: debouncedSearchText.length > 0,
    initialData: []
  }) as { data: GroupListRowProp[], isLoading: boolean }

  useEffect(() => {
    navigation.setOptions({
      header: () => <ChatSearchBar searchText={searchText} setSearchText={setSearchText} />,
    })
  }, [searchText])

  return (
    <View className="web:max-w-xl w-full flex-row justify-center">
      {(contacts?.length || groups?.length) ? <View className="w-full">
        {contacts?.length ? <View>
          <Text className="px-4">Contacts</Text>
          <FlatList
            data={contacts}
            renderItem={({ item }) => <ContactListRow {...item} />}
          />
        </View> : <></>}
        {contacts?.length && groups?.length ? <Separator className="my-4" /> : <></>}
        {groups?.length ? <View>
          <Text className="px-4">Groups</Text>
          <FlatList
            data={groups}
            renderItem={({ item }) => <GroupListRow {...item} />}
          />
        </View> : <></>}
      </View> :
        <FlatList
          data={rooms}
          renderItem={({ item }) => <ChatListRow {...item} />}
          keyExtractor={(item) => item.id.toString()}
          ItemSeparatorComponent={() => <Separator />}
        />}
    </View>
  );
}