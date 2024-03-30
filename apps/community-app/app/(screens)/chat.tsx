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

type MessageListRowProp = {
    id: string
    content: string,
    date_created: string,
    image: string | null,
    room_id: string,
    user_created: Pick<User, "first_name" | "id" | "avatar">
}

const ChatScreen = ({ data }: { data: MessageListRowProp[] }) => {
    const userData = useContext(UserContext)
    const messages: IMessage[] = data.map(d => ({
        _id: d.id,
        text: d.content,
        createdAt: new Date(d.date_created),
        user: {
            _id: d.user_created.id,
            avatar: buildAssetUrl(d.user_created.avatar),
            name: d.user_created.first_name
        }
    }))

    return <GiftedChat
        renderInputToolbar={(props) => <InputToolbar {...props} containerStyle={{borderRadius: 9999, backgroundColor: "transparent"}} />}
        messages={messages}
        user={{ _id: userData?.id! }}
    />
}

const ChatListRow = (props: ChatListRowProp) => {
    const userData = useContext(UserContext)
    const receiver = props.members.find(member => member.directus_users_id.id !== userData?.id)

    return <Pressable onPress={() => router.push({ pathname: "/chat", params: { roomId: props.id! } })} className="flex-row gap-4 items-center">
        <Image className="w-16 h-16 rounded-full" source={{ uri: buildAssetUrl(receiver?.directus_users_id.avatar!) }} />
        <Text>{receiver?.directus_users_id.first_name}</Text>
    </Pressable>
}

export default function Chat() {
    const userData = useContext(UserContext)
    const authData = useContext(AuthContext)
    const { roomId } = useGlobalSearchParams()
    const { data: roomsRes, isLoading: isRoomsResLoading } = useQuery({
        queryKey: ["Chat Rooms", userData?.id],
        queryFn: () => fetch(`${directusUrl}/items/rooms?[members][_contains]=${userData?.id}&fields=id,members.directus_users_id.first_name,members.directus_users_id.id,members.directus_users_id.avatar`, {
            headers: {
                "Authorization": `Bearer ${authData?.access_token}`
            }
        }).then(res => res.json())
    })
    const { data: messagesRes, isLoading: isMessagesResLoading, status } = useQuery({
        queryKey: ["Messages", roomId],
        queryFn: () => fetch(`${directusUrl}/items/messages?fields=*,user_created.id,user_created.avatar,user_created.first_name`, {
            headers: {
                "Authorization": `Bearer ${authData?.access_token}`
            }
        }).then(res => res.json()),
        enabled: !!roomId
    })
    if (isRoomsResLoading) return <View></View>
    if (isMessagesResLoading) return <View></View>
    const { data: rooms } = roomsRes as { data: ChatListRowProp[] }
    const messages = messagesRes?.data as MessageListRowProp[]

    return roomId ? <ChatScreen data={messages} /> :
        <View className="max-w-lg mx-auto p-2 w-full items-center">
            <FlatList
                data={rooms}
                renderItem={({ item }) => <ChatListRow {...item} />}
                keyExtractor={(item) => item.id.toString()}
                ItemSeparatorComponent={() => <View className="h-[1px] bg-foreground mx-2"></View>}
            />
        </View>
}