import { readItems } from "@directus/sdk";
import { SearchBar } from "@rneui/themed";
import { useQuery } from "@tanstack/react-query";
import { router, useNavigation } from "expo-router";
import { Dispatch, SetStateAction, useContext, useEffect, useState } from "react";
import { Image, Platform, Pressable, View } from "react-native";
import { FlatList } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useDebounce } from "use-debounce";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import { LargeScreenContext } from "~/context/large-screen";
import { buildAssetUrl, searchBarContainerStyle, searchBarInputContainerStyle, shortString, timeAgo } from "~/lib/helpers";
import { useColorScheme } from "~/lib/useColorScheme";
import directusStore from "~/store/directus";
import userStore from "~/store/user";
import { Message, Room, User } from "~/types";


type ChatListRowProp = Pick<Room, "avatar" | "id" | "type" | "title"> & {
  members: { directus_users_id: Pick<User, "avatar" | "first_name" | "last_name" | "id"> }[];
};

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
  const { data, isLoading } = useQuery({
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

  const lastMessage = data?.length ? shortString(data[0].content, 40) || "Open chat to see attachment" : null;

  return (data && data.length > -1) ? (
    <Button variant={"ghost"}
      style={{ height: 52, padding: 0, borderRadius: 0 }}
      onPress={() => router.push(`/chat/${room.id}`)}
      className="flex-row gap-4 items-center w-full justify-start">
      <Image className="w-8 h-8 rounded-full" source={{ uri: roomAvatar }} />
      <View className="flex-col justify-center flex-1">
        <View className="flex-row justify-between items-center">
          <Text className="!text-base">{roomName}</Text>
          {data.length ? <Text className="!text-sm text-subtext">{timeAgo.format(new Date(data[0].date_created))}</Text> : <></>}
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

export const ChatList = () => {
  const { rest } = directusStore()
  const { user } = userStore();
  const [searchText, setSearchText] = useState("")
  const [debouncedSearchText] = useDebounce(searchText, 500)

  const { data: rooms, isLoading } = useQuery({
    queryKey: ["Chat Rooms", user?.id],
    queryFn: async () => await rest.request(readItems("rooms", {
      fields: ['id', 'avatar', 'isGroup', 'title', 'members.directus_users_id.first_name', 'members.directus_users_id.last_name', 'members.directus_users_id.id', 'members.directus_users_id.avatar'
      ],
      filter: {
        members: {
          directus_users_id: {
            id: {
              _eq: user?.id,
            },
          },
        },
      }
    })),
  }) as { data: ChatListRowProp[], isLoading: boolean };

  return isLoading ? <View /> :
    <FlatList
      data={rooms}
      renderItem={({ item }) => <ChatListRow {...item} />}
      keyExtractor={(item) => item.id.toString()}
    />
};

export default function ChatScreen() {
  const navigation = useNavigation();
  const [searchText, setSearchText] = useState("")


  useEffect(() => {
    navigation.setOptions({
      header: () => <ChatSearchBar searchText={""} setSearchText={() => { }} />,
    })
  }, [searchText])

  return (
    <View className="web:max-w-xl w-full flex-row justify-center">
      <ChatList />
    </View>
  );
}