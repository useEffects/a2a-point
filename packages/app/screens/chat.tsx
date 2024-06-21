import { Header } from "app/components/header";
import SearchBar from "app/components/searchbar";
import { Separator } from "app/components/ui/separator";
import { Text } from "app/components/ui/text";
import { useColorScheme } from "app/hooks/color-scheme";
import userStore from "app/store/user";
import { useMemo, useState } from "react";
import { Image, Platform, ScrollView, View } from "react-native";
import { useDebounce } from "use-debounce";
import { RoomSubscribed } from "app/context/chats"
import { useChats } from "app/hooks/chats"
import { buildAssetUrl, getDMRoomId, timeAgo } from "app/lib/helpers";
import { GoToRoomButton } from "app/components/link-buttons";
import { Room, User } from "app/lib/types";
import directusStore from "app/store/directus";
import { useQuery } from "@tanstack/react-query"
import { directusUrl } from "app/lib/constants";
import { readItems } from "@directus/sdk";
import { FlatList } from "app/components/utils/virtual-lists";

export default function ChatScreen() {
    const { rest, token } = directusStore()
    const [searchText, setSearchText] = useState("")
    const [debouncedSearchText] = useDebounce(searchText, 500)
    const { roomsSubscribed, messages } = useChats()

    const filteredRoomsSubscribed = useMemo(() => {
        return roomsSubscribed.sort((a, b) => {
            const lastMessageDateCreated = (room: RoomSubscribed) => messages
                .filter((message) => message.room === room.id)
                .sort((a, b) => new Date(b.date_created).getTime() - new Date(a.date_created).getTime())[0]?.date_created
            const aDate = lastMessageDateCreated(a)
            const bDate = lastMessageDateCreated(b)
            if (!aDate || !bDate) return 0
            else {
                return new Date(bDate).getTime() - new Date(aDate).getTime()
            }
        })
    }, [roomsSubscribed, messages])

    const { data: contacts } = useQuery({
        queryKey: ["Fetch Contacts", debouncedSearchText],
        queryFn: async () => await fetch(`${directusUrl}/users/?fields=${["id", "first_name", "last_name", "avatar"].join(",")}&search=${encodeURIComponent(debouncedSearchText)}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }).then((res) => res.json()).then((res) => res.data),
        enabled: debouncedSearchText.length > 0,
        initialData: []
    })

    const { data: groups } = useQuery({
        queryKey: ["Fetch Rooms", debouncedSearchText],
        queryFn: async () => await rest.request(readItems("rooms", {
            fields: ['id', 'avatar', 'title'],
            search: debouncedSearchText,
            filter: {
                type: {
                    _eq: "group"
                }
            }
        })),
        enabled: debouncedSearchText.length > 0,
        initialData: []
    }) as { data: GroupListRowProp[], isLoading: boolean }

    return <View className="flex-col h-full native:pb-14">
        <View className="p-4 bg-card">
            <SearchBar
                searchText={searchText}
                setSearchText={setSearchText}
            />
        </View>
        {(contacts?.length || groups?.length) ? <View className="w-full">
            {contacts?.length ? <View>
                <Text className="p-4 text-info">Contacts</Text>
                <FlatList
                    data={contacts}
                    renderItem={({ item }) => <ContactListRow {...item} />}
                />
            </View> : <></>}
            {groups?.length ? <View>
                <Text className="p-4 text-info">Groups</Text>
                <FlatList
                    data={groups}
                    renderItem={({ item }) => <GroupListRow {...item} />}
                />
            </View> : <></>}
        </View> :
            <FlatList
                data={filteredRoomsSubscribed}
                renderItem={({ item }) => <ChatListRow {...item} />}
                ItemSeparatorComponent={() => <Separator />}
                bounces={false}
                overScrollMode="never"
            />}
    </View>
}

const ChatListRow = (room: RoomSubscribed) => {
    const { user } = userStore();
    const { messages } = useChats()

    const lastMessage = messages.find((message) => message.room === room.id);
    let lastMessageContent = lastMessage?.content.trim();
    if (lastMessageContent === "") {
        lastMessageContent = `Attachment: ${lastMessage?.assets?.[0]!.name}`
    }
    if (lastMessage?.user_created.id === user?.id) {
        lastMessageContent = `You: ${lastMessageContent}`
    } else if (room.type === "group" && lastMessage?.user_created.id !== user?.id) {
        lastMessageContent = `${lastMessage?.user_created.first_name}: ${lastMessageContent}`
    }

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

    return <GoToRoomButton roomId={room.id} variant={"ghost"}
        className="flex-row gap-4 items-center w-full justify-start h-20 px-4">
        <Image className="w-12 h-12 rounded-full" source={{ uri: roomAvatar }} />
        <View className="flex-col justify-center flex-1">
            <View className="flex-row justify-between items-center">
                <Text className="!text-base">{roomName}</Text>
                {lastMessage ? <Text className="!text-sm text-subtext">{timeAgo.format(new Date(lastMessage.date_created))}</Text> : <></>}
            </View>
            {lastMessage ? <Text className="!text-sm text-subtext !font-normal">{lastMessageContent}</Text> : <></>}
        </View>
    </GoToRoomButton>
};

type ContactListRowProp = Pick<User, "avatar" | "id" | "first_name" | "last_name">
type GroupListRowProp = Pick<Room, "avatar" | "id" | "type" | "title">

const ContactListRow = (contact: ContactListRowProp) => {
    const { user } = userStore()
    return <GoToRoomButton roomId={getDMRoomId([user.id, contact.id])} variant={"ghost"} size={"none"}
        className="flex-row gap-4 items-center w-full justify-start px-4 h-20">
        <Image className="w-12 h-12 rounded-full" source={{ uri: buildAssetUrl(contact.avatar) }} />
        <Text className="!text-base">{contact.first_name} {contact.last_name}</Text>
    </GoToRoomButton>
}

const GroupListRow = (group: GroupListRowProp) => {
    return <GoToRoomButton roomId={group.id} variant={"ghost"} size={"none"}
        className="flex-row gap-4 items-center w-full justify-start px-4 h-20">
        <Image className="w-12 h-12 rounded-full" source={{ uri: buildAssetUrl(group.avatar) }} />
        <Text className="!text-base">{group.title}</Text>
    </GoToRoomButton>
}