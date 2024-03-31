import { useQuery } from "@tanstack/react-query";
import { Link, useGlobalSearchParams, useNavigation } from "expo-router";
import { useContext, useEffect } from "react";
import { Image, View } from "react-native";
import { IMessage, GiftedChat, InputToolbar } from "react-native-gifted-chat";
import { Text } from "~/components/ui/text";
import { AuthContext } from "~/context/auth";
import { UserContext } from "~/context/user";
import { directusUrl } from "~/lib/constants";
import { buildAssetUrl } from "~/lib/helpers";
import { User } from "~/types";
import { MaterialIcons } from "@expo/vector-icons";

type MessageListRowProp = {
    id: string;
    content: string;
    date_created: string;
    image: string | null;
    room_id: string;
    user_created: Pick<User, "first_name" | "id" | "avatar">;
};

const ChatScreen = ({ data }: { data: MessageListRowProp[] }) => {
    const userData = useContext(UserContext);
    const authData = useContext(AuthContext);
    const messages: IMessage[] = data.map((d) => ({
        _id: d.id,
        text: d.content,
        createdAt: new Date(d.date_created),
        user: {
            _id: d.user_created.id,
            avatar: buildAssetUrl(d.user_created.avatar, authData?.access_token!),
            name: d.user_created.first_name,
        },
    }));

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

export default function Room() {
    const authData = useContext(AuthContext);
    const userData = useContext(UserContext);
    const { roomId } = useGlobalSearchParams();

    const { data: messagesRes, isLoading: isMessagesResLoading } = useQuery({
        queryKey: ["Messages", roomId],
        queryFn: () =>
            fetch(
                `${directusUrl}/items/messages?fields=*,user_created.id,user_created.avatar,user_created.first_name`,
                {
                    headers: {
                        Authorization: `Bearer ${authData?.access_token}`,
                    },
                }
            ).then((res) => res.json()),
        enabled: !!roomId,
    });
    const { data: roomRes, isLoading: isRoomResLoading } = useQuery({
        queryKey: ["Fetch Room by ID", roomId],
        queryFn: () =>
            fetch(
                `${directusUrl}/items/rooms/${roomId}?fields=isGroup,title,members.directus_users_id.id,members.directus_users_id.first_name,members.directus_users_id.avatar`,
                {
                    headers: {
                        Authorization: `Bearer ${authData?.access_token}`,
                    },
                }
            ).then((res) => res.json()),
        enabled: !!roomId,
    });

    const navigation = useNavigation();
    useEffect(() => {
        if (isRoomResLoading || !roomRes?.data) {
            return;
        }
        const { data: room } = roomRes as {
            data: {
                isGroup: boolean;
                title: string;
                avatar: string;
                members: {
                    directus_users_id: Pick<User, "id" | "avatar" | "first_name">;
                }[];
            };
        };
        const receiver = room.members.find(
            (m) => m.directus_users_id.id !== userData?.id
        )?.directus_users_id;
        const [roomName, roomAvatar] = room.isGroup
            ? [
                room.title,
                room.avatar
                    ? buildAssetUrl(room.avatar, authData?.access_token!)
                    : "https://dev.a2apoint.com/logo.svg",
            ]
            : [
                receiver!.first_name,
                buildAssetUrl(receiver!.avatar, authData?.access_token!),
            ];
        navigation.setOptions({
            headerLeft: ({ tintColor }: { tintColor: string }) => (
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

    return isMessagesResLoading ||
        isRoomResLoading ||
        !messagesRes?.data ||
        !roomRes?.data ? (
        <View />
    ) : (
        <ChatScreen data={messagesRes?.data} />
    );
}
