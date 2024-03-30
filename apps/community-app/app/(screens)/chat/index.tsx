import { useQuery } from "@tanstack/react-query";
import { router, useGlobalSearchParams, useLocalSearchParams } from "expo-router";
import { useCallback, useContext } from "react";
import { Image, Pressable, View } from "react-native";
import { FlatList } from "react-native";
import { Text } from "~/components/ui/text";
import { AuthContext } from "~/context/auth";
import { UserContext } from "~/context/user";
import { directusUrl } from "~/lib/constants";
import { buildAssetUrl } from "~/lib/helpers";
import { User } from "~/types";
import { GiftedChat, IMessage, InputToolbar } from "react-native-gifted-chat"

type ChatListRowProp = {
    id: string,
    members: {
        directus_users_id: {
            first_name: string,
            id: string,
            avatar: string
        },
    }[]
}

const ChatListRow = (props: ChatListRowProp) => {
    const userData = useContext(UserContext)
    const receiver = props.members.find(member => member.directus_users_id.id !== userData?.id)

    return <Pressable onPress={() => router.push(`/chat/${props.id}`)} className="flex-row gap-4 items-center w-full">
        <Image className="w-10 h-10 rounded-full" source={{ uri: buildAssetUrl(receiver?.directus_users_id.avatar!) }} />
        <Text>{receiver?.directus_users_id.first_name}</Text>
    </Pressable>
}

export default function Chat() {
    const userData = useContext(UserContext)
    const authData = useContext(AuthContext)
    
    const { data: roomsRes, isLoading: isRoomsResLoading } = useQuery({
        queryKey: ["Chat Rooms", userData?.id],
        queryFn: () => fetch(`${directusUrl}/items/rooms?[members][_contains]=${userData?.id}&fields=id,members.directus_users_id.first_name,members.directus_users_id.id,members.directus_users_id.avatar`, {
            headers: {
                "Authorization": `Bearer ${authData?.access_token}`
            }
        }).then(res => res.json())
    })
   
    if (isRoomsResLoading) return <View></View>
    const { data: rooms } = roomsRes as { data: ChatListRowProp[] }

    return <View className="max-w-lg mx-auto p-2 w-full flex-row justify-center">
        <FlatList
            data={rooms}
            renderItem={({ item }) => <ChatListRow {...item} />}
            keyExtractor={(item) => item.id.toString()}
            ItemSeparatorComponent={() => <View className="h-[1px] bg-foreground mx-2"></View>}
        />
    </View>
}