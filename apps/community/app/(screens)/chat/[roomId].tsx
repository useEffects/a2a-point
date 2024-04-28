import { readItems } from "@directus/sdk";
import { Ionicons } from "@expo/vector-icons";
import { SearchBar } from "@rneui/themed";
import { useQuery } from "@tanstack/react-query";
import { randomUUID } from "expo-crypto";
import { useGlobalSearchParams, useNavigation } from "expo-router";
import { Dispatch, SetStateAction, useContext, useEffect, useState } from "react";
import { Image, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useDebounce } from "use-debounce";
import { BackButton } from "~/components/back";
import { ChatUi, CurrentMessage } from "~/components/chat-ui";
import { Button } from "~/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "~/components/ui/dropdown-menu";
import { Text } from "~/components/ui/text";
import { ChatsContext, RoomSubscribed } from "~/context/chats";
import { buildAssetUrl, searchBarContainerStyle, searchBarInputContainerStyle } from "~/lib/helpers";
import { useColorScheme } from "~/lib/useColorScheme";
import directusStore from "~/store/directus";
import userStore from "~/store/user";
import { File, Message, User } from "~/types";

type InitialDataType = Omit<Message, "assets"> & {
    user_created: Pick<User, "avatar" | "id" | "first_name" | "last_name">
} & {
    assets: {
        directus_files_id: Pick<File, "id" | "type" | "filename_download">
    }[]
}

const ChatDropDownMenu = (props: { open: boolean, setOpen: Dispatch<SetStateAction<boolean>> }) => {
    return <DropdownMenu open={props.open} onOpenChange={props.setOpen}>
        <DropdownMenuTrigger asChild>
            <Button variant={"ghost"} size={"icon"} onPress={() => props.setOpen(p => !p)}>
                <Ionicons name={props.open ? "close-outline" : "ellipsis-vertical-outline"} size={18} className="!text-foreground" />
            </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
            <DropdownMenuItem>
                <Text className="!text-sm">See profile</Text>
            </DropdownMenuItem>
            <DropdownMenuItem>
                <Text className="!text-sm">Browse listings</Text>
            </DropdownMenuItem>
            <DropdownMenuItem>
                <Text className="!text-sm">Open in dashboard</Text>
            </DropdownMenuItem>
        </DropdownMenuContent>
    </DropdownMenu>
}

const ChatScreen = ({ roomDetails }: { roomDetails: { roomName: string, roomAvatar: string, roomId: string, isGroup: boolean } }) => {
    const { roomName, roomAvatar, roomId, isGroup } = roomDetails

    const { messages, setMessage, loadMoreMessages } = useContext(ChatsContext)

    const { rest } = directusStore()
    const insets = useSafeAreaInsets()
    const navigator = useNavigation()
    const { user } = userStore()
    const [searchBarVisible, setSearchBarVisible] = useState(false)
    const [searchText, setSearchText] = useState("")
    const [scrollToIndex, setScrollToIndex] = useState<number>(0)
    const [debouncedSearchText] = useDebounce(searchText, 500);
    const { colors } = useColorScheme()
    const [openDropdown, setOpenDropdown] = useState(false)
    const [currentMessage, setCurrentMessage] = useState<CurrentMessage>({ text: "" })
    const [offset, setOffset] = useState(1)
    const [endReached, setEndReached] = useState(false)

    const { data: scrollToMessages, isLoading: isScrollToMessagesLoading } = useQuery({
        queryKey: ["Search Messages", debouncedSearchText, roomId],
        queryFn: async () => await rest.request(readItems("messages", {
            filter: {
                room: {
                    _eq: roomId
                }
            },
            fields: ["id"],
            search: debouncedSearchText,
            sort: ["-date_created"],
        })),
        enabled: !!debouncedSearchText && debouncedSearchText.length > 2,
        initialData: [],
        staleTime: 0
    }) as { data: { id: string }[], isLoading: boolean }

    const handleSend = () => {
        if (!currentMessage.text && !(currentMessage.assets && currentMessage.assets.length)) return
        setMessage({
            id: randomUUID(),
            content: currentMessage.text,
            room: roomId,
            user_created: user!,
            date_created: new Date().toISOString(),
            sent: false,
            assets: currentMessage.assets?.length ? currentMessage.assets : undefined
        })
        setCurrentMessage({ text: "" })
    }

    const handleEndReached = async () => {
        if (isScrollToMessagesLoading || endReached) return
        const isAdded = await loadMoreMessages(offset, roomId)
        setOffset(p => p + 1)
        if (!isAdded) setEndReached(true)
    }

    useEffect(() => {
        navigator.setOptions({
            headerLeft: () => <BackButton />,
            header: () => <View className="flex-row items-center shadow bg-card h-24" style={{ paddingTop: insets.top }}>
                <BackButton />
                <View className="flex-1">
                    {searchBarVisible ? <View className="flex-row items-center pr-2">
                        <SearchBar
                            placeholder="Search"
                            containerStyle={searchBarContainerStyle}
                            inputContainerStyle={{ ...searchBarInputContainerStyle, borderColor: colors.border, height: 36 }}
                            inputStyle={{ fontSize: 14 }}
                            value={searchText}
                            onChangeText={setSearchText}
                            cursorColor={colors.primary}
                            showLoading={isScrollToMessagesLoading}
                            autoFocus={true}
                        />
                        {(scrollToMessages && scrollToMessages.length) ? <View className="flex-row gap-2 items-center px-1">
                            <Text>{scrollToIndex + 1} / {scrollToMessages.length}</Text>
                            <View className="flex-row">
                                <Button disabled={scrollToIndex === scrollToMessages.length - 1} className="mx-0" onPress={() => (scrollToIndex < scrollToMessages.length - 1) && setScrollToIndex(p => p + 1)} variant={"ghost"} size={"icon"}>
                                    <Ionicons name={"chevron-up-outline"} size={18} className="!text-foreground" />
                                </Button>
                                <Button disabled={scrollToIndex === 0} className="mx-0" variant={"ghost"} size={"icon"} onPress={() => (scrollToIndex > 0) && setScrollToIndex(p => p - 1)}>
                                    <Ionicons name={"chevron-down-outline"} size={18} className="!text-foreground" />
                                </Button>
                            </View>
                        </View> : <></>}
                        <Button variant={"ghost"} size={"icon"} onPress={() => { setSearchBarVisible(false); setSearchText("") }}>
                            <Ionicons name={"return-up-forward-outline"} size={18} className="!text-foreground" />
                        </Button>
                    </View> : <View className="flex-row justify-between items-center mx-2">
                        <View className="flex-row items-center gap-2">
                            <Image source={{ uri: roomAvatar }} className="w-8 h-8 rounded-full" />
                            <Text>{roomName}</Text>
                        </View>
                        <View className="flex-row items-center gap-2">
                            <Button variant={"ghost"} size={"icon"} onPress={() => setSearchBarVisible(true)}>
                                <Ionicons name={"search-outline"} size={18} className="!text-foreground" />
                            </Button>
                            <ChatDropDownMenu open={openDropdown} setOpen={setOpenDropdown} />
                        </View>
                    </View>}
                </View>
            </View>
        })

        return
    }, [searchBarVisible, searchText, scrollToMessages, scrollToIndex, openDropdown, roomId, roomAvatar, roomName])

    useEffect(() => {
        function removeHeader() {
            navigator.addListener("blur", () => {
                navigator.setOptions({
                    header: () => null
                })
            })
        }
        return removeHeader
    }, [navigator])

    return <ChatUi
        currentUserId={user?.id!}
        messages={messages.filter(m => m.room === roomId)}
        goToId={scrollToMessages[scrollToIndex]?.id}
        currentMessage={currentMessage}
        currentMessageDispatcher={setCurrentMessage}
        onSend={handleSend}
        isGroup={isGroup}
        listProps={{
            onEndReachedThreshold: 0,
            onEndReached: handleEndReached,
        }}
    />
}

export default function RoomScreen() {
    const { roomId } = useGlobalSearchParams();
    const { user } = userStore()
    const { roomsSubscribed, addRoom } = useContext(ChatsContext)
    const [room, setRoom] = useState<RoomSubscribed | null | undefined>()
    const [roomDetails, setRoomDetails] = useState<{ roomId: string, roomName: string, roomAvatar: string, isGroup: boolean }>()

    useEffect(() => {
        if (!roomId) {
            setRoomDetails(undefined)
        }
        async function init() {
            const found = roomsSubscribed.find(r => r.id === roomId)
            if (found) {
                setRoom(found)
            } else {
                const _room = await addRoom(roomId as string)
                setRoom(_room)
            }
        }
        init()
    }, [roomId])

    useEffect(() => {
        const receivers = room?.members.filter(
            (m) => m.directus_users_id.id !== user?.id,
        );
        if (roomId && receivers && receivers.length > 0) {
            const [roomName, roomAvatar] = room?.type === "group"
                ? [room?.title!, buildAssetUrl(room?.avatar)]
                : [
                    `${receivers[0].directus_users_id.first_name} ${receivers[0].directus_users_id.last_name}`,
                    buildAssetUrl(receivers[0].directus_users_id.avatar),
                ];
            setRoomDetails({ roomId: roomId as string, roomName, roomAvatar, isGroup: room?.type === "group" })
        }
    }, [roomId, room])

    if (room === undefined) {
        return null
    }

    if (room === null) {
        return null
    }

    return (roomDetails && roomId) ? <ChatScreen
        roomDetails={roomDetails}
    /> : <></>
}