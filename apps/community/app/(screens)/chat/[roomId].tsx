import { readItems } from "@directus/sdk";
import { Ionicons } from "@expo/vector-icons";
import { BottomSheet, SearchBar } from "@rneui/themed";
import { useQuery } from "@tanstack/react-query";
import { randomUUID } from "expo-crypto";
import { router, useGlobalSearchParams, useNavigation } from "expo-router";
import { Dispatch, SetStateAction, useContext, useEffect, useState } from "react";
import { Image, ScrollView, View } from "react-native";
import { useDebounce } from "use-debounce";
import { BackButton, Header } from "~/components/header";
import { ChatUi, CurrentMessage } from "~/components/chat-ui";
import { Button } from "~/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "~/components/ui/dropdown-menu";
import { Text } from "~/components/ui/text";
import { ChatsContext, Member, RoomSubscribed } from "~/context/chats";
import { buildAssetUrl, searchBarContainerStyle, searchBarInputContainerStyle } from "~/lib/helpers";
import { useColorScheme } from "~/lib/useColorScheme";
import directusStore from "~/store/directus";
import userStore from "~/store/user";
import { CommonFilters } from "~/components/listings-cards/body/listings";

const ChatDropDownMenu = (props: { members: Member[], isGroup: boolean, open: boolean, setOpen: Dispatch<SetStateAction<boolean>>, roomId: string }) => {

    const [bottomSheetVisible, setBottomSheetVisible] = useState(false)

    const handleMembers = () => {
        if (props.isGroup) {
            setBottomSheetVisible(true)
        } else {
            router.push(`/profile/${props.members[0].directus_users_id.id}`)
        }
    }

    const handleBrowseListings = () => {
        if (props.isGroup) {
            router.push({
                pathname: "/discover",
                params: {
                    id: props.roomId,
                    filter: CommonFilters.GroupId
                }
            })
        } else {
            router.push({
                pathname: "/discover",
                params: {
                    id: props.members[0].directus_users_id.id,
                    filter: CommonFilters.User
                }
            })
        }
    }

    return <View>
        <DropdownMenu open={props.open} onOpenChange={props.setOpen}>
            <DropdownMenuTrigger asChild>
                <Button variant={"ghost"} size={"icon"} onPress={() => props.setOpen(p => !p)}>
                    <Ionicons name={props.open ? "close-outline" : "ellipsis-vertical-outline"} size={18} className="!text-foreground" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuItem onPress={handleMembers}>
                    {props.isGroup ? <Text className="!text-sm">See members</Text> :
                        <Text className="!text-sm">See profile</Text>}
                </DropdownMenuItem>
                <DropdownMenuItem onPress={handleBrowseListings}>
                    <Text className="!text-sm">Browse listings</Text>
                </DropdownMenuItem>
                <DropdownMenuItem>
                    <Text className="!text-sm">Mute notifications</Text>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
        <BottomSheet isVisible={bottomSheetVisible} onBackdropPress={() => setBottomSheetVisible(false)}>
            <View className="bg-card flex-col gap-4 py-4">
                <View className="flex-row justify-between px-4">
                    <Text>Members</Text>
                    <Button onPress={() => setBottomSheetVisible(false)} variant={"destructive"} size={"icon"} className="w-6 h-6">
                        <Ionicons name="close-outline" size={18} className="!text-destructive-foreground" />
                    </Button>
                </View>
                <ScrollView className="flex-col gap-4">
                    {props.members.map((member, index) => <Button onPress={() => router.push(`/profile/${member.directus_users_id.id}`)} variant={"ghost"} key={index} className="flex-row items-center justify-start gap-2 native:!px-4 px-4">
                        <Image source={{ uri: buildAssetUrl(member.directus_users_id.avatar) }} className="w-8 h-8 rounded-full" />
                        <Text>{member.directus_users_id.first_name} {member.directus_users_id.last_name}</Text>
                    </Button>)}
                </ScrollView>
            </View>
        </BottomSheet>
    </View>
}

const ChatScreen = ({ roomDetails, receivers }: {
    roomDetails: { roomName: string, roomAvatar: string, roomId: string, isGroup: boolean }, receivers: Member[]
}) => {
    const { roomName, roomAvatar, roomId, isGroup } = roomDetails

    const { messages, setMessage, loadMoreMessages } = useContext(ChatsContext)

    const { rest } = directusStore()
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
            header: () => <Header>
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
                    </View> : <View className="flex-row justify-between items-center">
                        <View className="flex-row items-center gap-2">
                            <Image source={{ uri: roomAvatar }} className="w-8 h-8 rounded-full" />
                            <Text>{roomName}</Text>
                        </View>
                        <View className="flex-row items-center gap-2">
                            <Button variant={"ghost"} size={"icon"} onPress={() => setSearchBarVisible(true)}>
                                <Ionicons name={"search-outline"} size={18} className="!text-foreground" />
                            </Button>
                            <ChatDropDownMenu roomId={roomId} members={receivers} isGroup={isGroup} open={openDropdown} setOpen={setOpenDropdown} />
                        </View>
                    </View>}
                </View>
            </Header>
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

    return <View className="flex-col h-full">
        <ChatUi
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
                className: "flex-1",
            }}
        />
    </View>
}

export default function RoomScreen() {
    const { roomId } = useGlobalSearchParams();
    const { user } = userStore()
    const { roomsSubscribed, addRoom } = useContext(ChatsContext)
    const [room, setRoom] = useState<RoomSubscribed | null | undefined>()
    const [roomDetails, setRoomDetails] = useState<{ roomId: string, roomName: string, roomAvatar: string, isGroup: boolean }>()
    const [receivers, setReceivers] = useState<Member[] | undefined>()

    useEffect(() => {
        async function init() {
            if (!roomId || typeof roomId !== "string") {
                setRoomDetails(undefined)
            } else {
                const found = roomsSubscribed.find(r => r.id === roomId)
                if (found) {
                    setRoom(found)
                } else {
                    const _room = await addRoom(roomId as string)
                    setRoom(_room)
                }
            }
        }
        init()
    }, [roomId])

    useEffect(() => {
        const _receivers = room?.members.filter(
            (m) => m.directus_users_id.id !== user?.id,
        );
        if (roomId && _receivers && _receivers.length > 0) {
            const [roomName, roomAvatar] = room?.type === "group"
                ? [room?.title!, buildAssetUrl(room?.avatar)]
                : [
                    `${_receivers[0].directus_users_id.first_name} ${_receivers[0].directus_users_id.last_name}`,
                    buildAssetUrl(_receivers[0].directus_users_id.avatar),
                ];
            setRoomDetails({ roomId: roomId as string, roomName, roomAvatar, isGroup: room?.type === "group" })
        }
        setReceivers(_receivers)
    }, [roomId, room])

    if (room === undefined) {
        return null
    }

    if (room === null) {
        return null
    }

    return (roomDetails && receivers?.length) ? <ChatScreen
        roomDetails={roomDetails}
        receivers={receivers}
    /> : <></>
}