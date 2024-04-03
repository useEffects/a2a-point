import { useQuery } from "@tanstack/react-query";
import { Link, useGlobalSearchParams, useNavigation } from "expo-router";
import { Dispatch, SetStateAction, useContext, useEffect, useState } from "react";
import { Image, Platform, View } from "react-native";
import { IMessage, GiftedChat, InputToolbar } from "react-native-gifted-chat";
import { Text } from "~/components/ui/text";
import { directusUrl, directusWSUrl } from "~/lib/constants";
import { buildAssetUrl } from "~/lib/helpers";
import { User, Room, Message } from "~/types";
import { MaterialIcons } from "@expo/vector-icons";

type ChatMessage = Message & { user_created: Pick<User, "first_name" | "id" | "avatar"> }

const readMessages = (ws: WebSocket, page: number, roomId: string) => {
    ws.send(JSON.stringify({
        type: "items",
        collection: "messages",
        action: "read",
        query: {
            filter: {
                room: {
                    _eq: roomId
                }
            },
            fields: ["*", "user_created.id", "user_created.avatar", "user_created.first_name"],
            sort: "-date_created",
            page: page
        }
    }))
}

const addMessages = (ws: WebSocket, dispatcher: Dispatch<SetStateAction<IMessage[]>>, access_token: string, data: { data: ChatMessage[] }) => {
    const { data: messagesRes } = data
    const _messages: IMessage[] = messagesRes.map((d) => ({
        _id: d.id,
        text: d.content,
        createdAt: new Date(d.date_created),
        user: {
            _id: d.user_created.id,
            avatar: buildAssetUrl(d.user_created.avatar),
            name: d.user_created.first_name,
        },
    }));
    dispatcher(prev => {
        const newMessages = _messages.filter(_message => !prev.some(message => message._id === _message._id));
        return [...prev, ...newMessages];
    });
}

const ChatScreen = ({ roomId }: { roomId: string }) => {
    const userData = useContext(UserContext);
    const authData = useContext(AuthContext);
    const [messages, setMessages] = useState<IMessage[]>([])
    const [page, setPage] = useState(1)
    const [ws, setWs] = useState<WebSocket>()

    useEffect(() => {
        const connection = new WebSocket(directusWSUrl);
        connection.addEventListener("open", () => {
            connection.send(JSON.stringify({
                type: "auth",
                access_token: authData?.access_token
            }))
        })
        connection.addEventListener("open", () => {
            connection.send(JSON.stringify({
                type: "auth",
                access_token: authData?.access_token
            }))
        })
        connection.addEventListener("message", (message: { data: any }) => {
            const data = JSON.parse(message.data)
            if (data.type === "auth" && data.status === "ok") {
                connection.send(JSON.stringify({
                    type: "subscribe",
                    collection: "messages",
                }))
            }
            setWs(connection)
        })
    }, [])

    useEffect(() => {
        if (!ws) return
        console.log("here")
        ws.addEventListener("message", (message: { data: any }) => {
            const data = JSON.parse(message.data)
            // console.log(data)
            if (data.type === "ping") {
                ws.send(JSON.stringify({ type: "pong" }))
            }
            if (data.type === "subscription" && data.event === "init") {
                readMessages(ws, page, roomId)
            }
            if (data.type === "items" || (data.type === "subscription" && data.event === "create")) {
                addMessages(ws, setMessages, authData?.access_token!, data)
            }
        })
    }, [ws]);

    return (
        <GiftedChat
            renderInputToolbar={(props) => (
                <InputToolbar
                    {...props}
                    containerStyle={{
                        borderRadius: 9999,
                        backgroundColor: "transparent",
                    }}
                />
            )}
            messages={messages}
            user={{ _id: userData?.id! }}
        />
    );
};

export default function RoomScreen() {
    const authData = useContext(AuthContext);
    const userData = useContext(UserContext);
    const { roomId } = useGlobalSearchParams();


    const { data: roomRes, isLoading: isRoomResLoading } = useQuery({
        queryKey: ["Fetch Room by ID", roomId],
        queryFn: () =>
            fetch(
                `${directusUrl}/items/rooms/${roomId}?fields=isGroup,title,avatar,members.directus_users_id.id,members.directus_users_id.first_name,members.directus_users_id.avatar`,
                {
                    headers: {
                        Authorization: `Bearer ${authData?.access_token}`,
                    },
                },
            ).then((res) => res.json()),
        enabled: !!roomId,
    });

    const navigation = useNavigation();
    useEffect(() => {
        if (isRoomResLoading || !roomRes?.data) {
            return;
        }
        const { data: room } = roomRes as {
            data: Pick<Room, "avatar" | "id" | "isGroup" | "title"> & {
                members: {
                    directus_users_id: Pick<User, "avatar" | "first_name" | "id">;
                }[];
            };
        };
        const receiver = room.members.find(
            (m) => m.directus_users_id.id !== userData?.id,
        )?.directus_users_id;
        const [roomName, roomAvatar] = room.isGroup
            ? [room.title, buildAssetUrl(room.avatar, authData?.access_token!)]
            : [
                receiver!.first_name,
                buildAssetUrl(receiver!.avatar, authData?.access_token!),
            ];
        navigation.setOptions({
            headerLeft:
                Platform.OS === "web"
                    ? () => <View />
                    : ({ tintColor }: { tintColor: string }) => (
                        <Link href={"/chat/"}>
                            <MaterialIcons name="arrow-left" size={24} color={tintColor} />
                        </Link>
                    ),
            headerTitle: () => (
                <View className="flex-row gap-4 items-center">
                    <Image
                        source={{ uri: roomAvatar }}
                        className="rounded-full w-10 h-10"
                    />
                    <Text>{roomName}</Text>
                </View>
            ),
        });
    }, [navigation, roomRes, isRoomResLoading]);

    return isRoomResLoading ||
        !roomRes?.data ? (
        <View />
    ) : (
        <ChatScreen roomId={roomId as string} />
    );
}
