import { useQuery } from "@tanstack/react-query";
import { Link, useGlobalSearchParams, useNavigation } from "expo-router";
import { useEffect, useState } from "react";
import { Image, Platform, View } from "react-native";
import { IMessage, GiftedChat, InputToolbar } from "react-native-gifted-chat";
import { Text } from "~/components/ui/text";
import { buildAssetUrl } from "~/lib/helpers";
import { User, Room, Message } from "~/types";
import { MaterialIcons } from "@expo/vector-icons";
import directusStore from "~/store/directus";
import { readItem, readItems } from "@directus/sdk";
import userStore from "~/store/user";

type ChatMessage = (Message & { user_created: Pick<User, "first_name" | "id" | "avatar"> })

const ChatScreen = ({ roomId }: { roomId: string }) => {
    const { realtime, rest } = directusStore()
    const { user } = userStore()
    const [ready, setReady] = useState(false)
    const [messages, setMessages] = useState<IMessage[]>([])
    const [page, setPage] = useState(1)

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
            console.log(_initialMessages)
            setMessages(_initialMessages)
            realtime.connect().then(async () => {
                setReady(true)
            })
        }
    }, [roomId, isInitialMessagesLoading])

    const handleSend = ([message]: IMessage[]) => {
        setMessages(prev => GiftedChat.append(prev, [message]))
        realtime.sendMessage({
            type: 'items',
            collection: 'messages',
            action: 'create',
            data: {
                content: message.text,
                room: {
                    id: roomId
                }
            },
        });
    }

    return (
        ready ? <GiftedChat
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
            onSend={handleSend}
            user={{ _id: user.id }}
        /> : <View />
    );
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
    }, [navigation, room, isLoading]);

    return isLoading ||
        !room?.id ? (
        <View />
    ) : (
        <ChatScreen roomId={roomId as string} />
    );
}
