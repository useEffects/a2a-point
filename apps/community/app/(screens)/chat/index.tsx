import { createItem, readItems } from "@directus/sdk";
import { SearchBar } from "@rneui/themed";
import { useQuery } from "@tanstack/react-query";
import { router, useNavigation } from "expo-router";
import { Dispatch, SetStateAction, useContext, useEffect, useState } from "react";
import { FlatList, Image, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useDebounce } from "use-debounce";
import { headerHeight } from "~/components/header";
import { Button } from "~/components/ui/button";
import { Separator } from "~/components/ui/separator";
import { Text } from "~/components/ui/text";
import { ChatsContext, RoomSubscribed } from "~/context/chats";
import { directusUrl } from "~/lib/constants";
import { buildAssetUrl, getDMRoomId, searchBarContainerStyle, searchBarInputContainerStyle, timeAgo } from "~/lib/helpers";
import { useColorScheme } from "~/lib/useColorScheme";
import directusStore from "~/store/directus";
import userStore from "~/store/user";
import { Room, User } from "~/types";

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
  const { addRoom } = useContext(ChatsContext)

  const handlePress = async () => {
    await addRoom(group.id)
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

const ChatListRow = (room: RoomSubscribed) => {
  const { user } = userStore();
  const { messages } = useContext(ChatsContext)

  const lastMessage = messages.find((message) => message.room === room.id);
  let lastMessageContent = lastMessage?.content.trim();
  if (lastMessageContent === "") {
    lastMessageContent = `Attachment: ${lastMessage?.assets?.[0].name}`
  }
  if (lastMessage?.user_created.id === user?.id) {
    lastMessageContent = `You: ${lastMessageContent}`
  } else if (room.type === "group" && lastMessage?.user_created.id !== user?.id) {
    lastMessageContent = `${lastMessage?.user_created.first_name}: ${lastMessageContent}`
  }

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

  const handlePress = () => {
    router.push(`/chat/${room.id}`)
  }

  return <Button variant={"ghost"}
    style={{ height: 72, padding: 0, borderRadius: 0 }}
    onPress={handlePress}
    className="flex-row gap-4 items-center w-full justify-start">
    <Image className="w-12 h-12 rounded-full" source={{ uri: roomAvatar }} />
    <View className="flex-col justify-center flex-1">
      <View className="flex-row justify-between items-center">
        <Text className="!text-base">{roomName}</Text>
        {lastMessage ? <Text className="!text-sm text-subtext">{timeAgo.format(new Date(lastMessage.date_created))}</Text> : <></>}
      </View>
      {lastMessage ? <Text className="!text-sm text-subtext">{lastMessageContent}</Text> : <></>}
    </View>
  </Button>
};

const ChatSearchBar = ({ searchText, setSearchText }: { searchText: string, setSearchText: Dispatch<SetStateAction<string>> }) => {
  const { colors } = useColorScheme()
  const insets = useSafeAreaInsets()
  return <View style={{ paddingTop: insets.top, height: headerHeight }}>
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
  const navigation = useNavigation();
  const [searchText, setSearchText] = useState("")
  const [debouncedSearchText] = useDebounce(searchText, 500)

  const { roomsSubscribed } = useContext(ChatsContext)

  const { data: contacts } = useQuery({
    queryKey: ["Fetch Contacts", debouncedSearchText],
    queryFn: async () => await fetch(`${directusUrl}/users/?fields=${["id", "first_name", "last_name", "avatar"].join(",")}&search=${encodeURIComponent(debouncedSearchText)}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }).then((res) => res.json()).then((res) => res.data),
    enabled: debouncedSearchText.length > 0,
    initialData: []
  })

  const { data: groups } = useQuery({
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
          data={roomsSubscribed}
          renderItem={({ item }) => <ChatListRow {...item} />}
          keyExtractor={(item) => item.id.toString()}
          ItemSeparatorComponent={() => <Separator />}
        />}
    </View>
  );
}