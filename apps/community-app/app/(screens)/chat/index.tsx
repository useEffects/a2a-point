import { useQuery } from "@tanstack/react-query";
import {
  router,
  useGlobalSearchParams,
  useLocalSearchParams,
} from "expo-router";
import { useCallback, useContext } from "react";
import { Image, Platform, Pressable, View } from "react-native";
import { FlatList } from "react-native";
import { Text } from "~/components/ui/text";
import { AuthContext } from "~/context/auth";
import { UserContext } from "~/context/user";
import { directusUrl } from "~/lib/constants";
import { buildAssetUrl } from "~/lib/helpers";
import { Room, User } from "~/types";

type ChatListRowProp = Pick<Room, "avatar" | "id" | "isGroup" | "title"> & {
  members: { directus_users_id: Pick<User, "avatar" | "first_name" | "id"> }[];
};

const ChatListRow = (room: ChatListRowProp) => {
  const userData = useContext(UserContext);
  const authData = useContext(AuthContext);
  const receiver = room.members.find(
    (member) => member.directus_users_id.id !== userData?.id,
  );
  const [roomName, roomAvatar] = room.isGroup
    ? [room.title, buildAssetUrl(room.avatar, authData?.access_token!)]
    : [
        receiver!.directus_users_id.first_name,
        buildAssetUrl(
          receiver!.directus_users_id.avatar,
          authData?.access_token!,
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
  const userData = useContext(UserContext);
  const authData = useContext(AuthContext);

  const { data: roomsRes, isLoading: isRoomsResLoading } = useQuery({
    queryKey: ["Chat Rooms", userData?.id],
    queryFn: () => {
      const filter = JSON.stringify({
        members: {
          directus_users_id: {
            id: {
              _eq: userData?.id,
            },
          },
        },
      });
      return fetch(
        `${directusUrl}/items/rooms?filter=${filter}&fields=id,avatar,isGroup,title,members.directus_users_id.first_name,members.directus_users_id.id,members.directus_users_id.avatar`,
        {
          headers: {
            Authorization: `Bearer ${authData?.access_token}`,
          },
        },
      ).then((res) => res.json());
    },
  });

  if (isRoomsResLoading) {
    return <View />;
  }
  const { data: rooms } = roomsRes as { data: ChatListRowProp[] };

  return (
    <FlatList
      data={rooms}
      renderItem={({ item }) => <ChatListRow {...item} />}
      keyExtractor={(item) => item.id.toString()}
    />
  );
};

export default function ChatScreen() {
  return (
    <View className="max-w-lg mx-auto p-2 w-full flex-row justify-center">
      {Platform.OS === "web" ? <View /> : <ChatList />}
    </View>
  );
}
