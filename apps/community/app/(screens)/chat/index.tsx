import { readItems } from "@directus/sdk";
import { useQuery } from "@tanstack/react-query";
import { router } from "expo-router";
import { useContext } from "react";
import { Image, Platform, Pressable, View } from "react-native";
import { FlatList } from "react-native";
import { Text } from "~/components/ui/text";
import { LargeScreenContext } from "~/context/large-screen";
import { buildAssetUrl } from "~/lib/helpers";
import directusStore from "~/store/directus";
import userStore from "~/store/user";
import { Room, User } from "~/types";

type ChatListRowProp = Pick<Room, "avatar" | "id" | "isGroup" | "title"> & {
  members: { directus_users_id: Pick<User, "avatar" | "first_name" | "id"> }[];
};

const ChatListRow = (room: ChatListRowProp) => {
  const { user } = userStore();
  const receiver = room.members.find(
    (member) => member.directus_users_id.id !== user?.id,
  );
  const [roomName, roomAvatar] = room.isGroup
    ? [room.title, buildAssetUrl(room.avatar)]
    : [
      receiver!.directus_users_id.first_name,
      buildAssetUrl(
        receiver!.directus_users_id.avatar,
      ),
    ];

  return (
    <Pressable
      onPress={() => router.push(`/chat/${room.id}`)}
      className="flex-row gap-4 my-2 items-center w-full">
      <Image className="w-10 h-10 rounded-full" source={{ uri: roomAvatar }} />
      <Text>{roomName}</Text>
    </Pressable>
  );
};

export const ChatList = () => {
  const { rest } = directusStore()
  const { user } = userStore();

  const { data: rooms, isLoading } = useQuery({
    queryKey: ["Chat Rooms", user?.id],
    queryFn: (async () => await rest.request(readItems("rooms", {
      fields: ['id', 'avatar', 'isGroup', 'title', 'members.directus_users_id.first_name', 'members.directus_users_id.id', 'members.directus_users_id.avatar'
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
    })) as ChatListRowProp[]),
  });

  return isLoading ? <View /> :
    <FlatList
      data={rooms}
      renderItem={({ item }) => <ChatListRow {...item} />}
      keyExtractor={(item) => item.id.toString()}
    />
};

export default function ChatScreen() {
  const isLargeScreen = useContext(LargeScreenContext)
  return (
    <View className="max-w-lg mx-auto p-2 w-full flex-row justify-center">
      {isLargeScreen ? <View /> : <ChatList />}
    </View>
  );
}