import { useQuery } from "@tanstack/react-query";
import { useGlobalSearchParams, useNavigation } from "expo-router";
import { useContext, useEffect } from "react";
import { View } from "react-native";
import { IMessage, GiftedChat, InputToolbar } from "react-native-gifted-chat";
import { AuthContext } from "~/context/auth";
import { UserContext } from "~/context/user";
import { directusUrl } from "~/lib/constants";
import { buildAssetUrl } from "~/lib/helpers";
import { User } from "~/types"

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
        renderInputToolbar={(props) => <InputToolbar {...props} containerStyle={{ borderRadius: 9999, backgroundColor: "transparent" }} />}
        messages={messages}
        user={{ _id: userData?.id! }}
    />
}

export default function Room() {
    const authData = useContext(AuthContext)
    const { roomId } = useGlobalSearchParams()
    const navigation = useNavigation()
    const { data: messagesRes, isLoading: isMessagesResLoading } = useQuery({
        queryKey: ["Messages", roomId],
        queryFn: () => fetch(`${directusUrl}/items/messages?fields=*,user_created.id,user_created.avatar,user_created.first_name`, {
            headers: {
                "Authorization": `Bearer ${authData?.access_token}`
            }
        }).then(res => res.json()),
        enabled: !!roomId
    })
    if (isMessagesResLoading || !messagesRes?.data) return <View></View>

    useEffect(() => {
        navigation.setOptions({ headerTitle: "DM" })
    }, [navigation])

    const messages = messagesRes?.data as MessageListRowProp[]

    return <ChatScreen data={messages} />
}