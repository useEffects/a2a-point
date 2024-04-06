import { useQuery } from "@tanstack/react-query";
import { Link, useGlobalSearchParams, useNavigation } from "expo-router";
import { useContext, useEffect, useState } from "react";
import { Image, Platform, View } from "react-native";
import { IMessage, GiftedChat, InputToolbar, Composer, Bubble } from "react-native-gifted-chat";
import { Text } from "~/components/ui/text";
import { buildAssetUrl } from "~/lib/helpers";
import { User, Room, Message } from "~/types";
import { MaterialIcons } from "@expo/vector-icons";
import directusStore from "~/store/directus";
import { readItem, readItems } from "@directus/sdk";
import userStore from "~/store/user";
import { LargeScreenContext } from "~/context/large-screen";
import { directusWSUrl } from "~/lib/constants";
import { useColorScheme } from "~/lib/useColorScheme";

type ChatMessage = (Message & { user_created: Pick<User, "first_name" | "id" | "avatar"> })

const ChatScreen = ({ roomId }: { roomId: string }) => {
    const { rest, token } = directusStore()
    const [ws, setWs] = useState<WebSocket>()
    const { user } = userStore()
    const [messages, setMessages] = useState<IMessage[]>([])
    const [ready, setReady] = useState(false)
    const [page, setPage] = useState(1)
    const { colors } = useColorScheme()

    function subscribe() {
        ws?.send(JSON.stringify({
            type: "subscribe",
            collection: "messages",
            query: {
                fields: ["*", "user_created.avatar", "user_created.id"]
            }
        }))
    }

    useEffect(() => {
        const ws = new WebSocket(`${directusWSUrl}?access_token=${token}`)
        ws.onopen = () => {
            setReady(true)
            setWs(ws)
            subscribe()
        }
        ws.addEventListener('open', function () {
            console.log({ event: 'onopen' });
        });

        ws.addEventListener('message', function (message) {
            const data = JSON.parse(message.data);
            console.log({ event: 'onmessage', data });
            if (data.type === "ping") {
                ws.send(JSON.stringify({
                    type: "pong"
                }))
            }
        });

        ws.addEventListener('close', function () {
            console.log({ event: 'onclose' });
        });

        ws.addEventListener('error', function (error) {
            console.log({ event: 'onerror', error });
        });
        return () => ws.close()
    }, [])

    const { data: initialMessages, isLoading: isInitialMessagesLoading } = useQuery({
        queryKey: ["Fetch Messages", roomId],
        queryFn: async () => await rest.request(readItems("messages", {
            filter: {
                room: {
                    _eq: roomId
                }
            },
            fields: ["*", "user_created.avatar", "user_created.id"],
            sort: ["-date_created"]
        })),
        enabled: !!roomId
    }) as { data: ChatMessage[], isLoading: boolean }

    useEffect(() => {
        if (isInitialMessagesLoading) {
            return
        } else {
            const _initialMessages = initialMessages.map(message => ({
                _id: message.id,
                text: message.content,
                createdAt: new Date(message.date_created),
                user: {
                    _id: message.user_created.id,
                    avatar: buildAssetUrl(message.user_created.avatar)
                },
                image: message.image ? buildAssetUrl(message.image) : undefined,
                sent: true
            })) as IMessage[]
            setMessages(_initialMessages)
            setReady(true)
        }
    }, [roomId, isInitialMessagesLoading])

    const handleSend = ([message]: IMessage[]) => {
        setMessages(prev => GiftedChat.append(prev, [message]))
        ws?.send(JSON.stringify({
            type: 'items',
            collection: 'messages',
            action: 'create',
            data: {
                content: message.text,
                room: {
                    id: roomId
                }
            },
        }));
    }

    return ready ? <GiftedChat
        renderInputToolbar={(props) => (
            <InputToolbar
                {...props}
                containerStyle={{
                    borderRadius: 9999,
                    backgroundColor: "transparent",
                }}
            />
        )}
        renderComposer={(props) => <Composer {...props} textInputStyle={{ color: colors.foreground }} />}
        messages={messages}
        onSend={handleSend}
        user={{ _id: user.id }}
        renderBubble={(props) => <Bubble
            {...props}
            wrapperStyle={{ left: { backgroundColor: colors.secondary }, right: { backgroundColor: colors.primary } }}
            textStyle={{ left: { color: colors["primary-foreground"] }, right: { color: colors["secondary-foreground"] } }}
        />}
    /> : <View />
};

export default function RoomScreen() {
    const { roomId } = useGlobalSearchParams();
    const { rest } = directusStore()
    const { user } = userStore()

    const { data: room, isLoading } = useQuery({
        queryKey: ["Fetch Room by ID", roomId],
        queryFn: async () => await rest.request(readItem("rooms", roomId as string, {
            fields: ["id", 'isGroup', 'title', 'avatar', 'members.directus_users_id.id', 'members.directus_users_id.first_name', 'members.directus_users_id.avatar']
        })),
        enabled: !!roomId && typeof roomId === "string"
    }) as {
        data: Pick<Room, "avatar" | "id" | "isGroup" | "title"> & {
            members: {
                directus_users_id: Pick<User, "avatar" | "first_name" | "id">;
            }[];
        }, isLoading: boolean
    }
    const navigation = useNavigation();
    useEffect(() => {
        if (isLoading || !room?.id) {
            return;
        }
        const receiver = room.members.find(
            (m) => m.directus_users_id.id !== user?.id,
        )?.directus_users_id;
        const [roomName, roomAvatar] = room.isGroup
            ? [room.title, buildAssetUrl(room.avatar)]
            : [
                receiver!.first_name,
                buildAssetUrl(receiver!.avatar),
            ];
        navigation.setOptions({
            headerBackButtonEnabled: true,
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
    }, [navigation, room, isLoading]);

    return isLoading ||
        !room?.id ? (
        <View />
    ) : <ChatScreen roomId={roomId as string} />
}
