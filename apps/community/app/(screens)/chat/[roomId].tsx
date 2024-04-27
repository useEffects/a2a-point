import { createNotification, createNotifications, readItem, readItems, uploadFiles } from "@directus/sdk";
import { Ionicons } from "@expo/vector-icons";
import { SearchBar } from "@rneui/themed";
import { useQuery } from "@tanstack/react-query";
import { randomUUID } from "expo-crypto";
import { useGlobalSearchParams, useNavigation } from "expo-router";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Image, Platform, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useDebounce } from "use-debounce";
import { ChatMessage, ChatUi, CurrentMessage, withId, withUri } from "~/components/chat-ui";
import { Button } from "~/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "~/components/ui/dropdown-menu";
import { Text } from "~/components/ui/text";
import { queryClient } from "~/index";
import { directusUrl, directusWSUrl, messagesFolderName } from "~/lib/constants";
import { buildAssetUrl, getNewFileUrl, searchBarContainerStyle, searchBarInputContainerStyle, uriToBlob } from "~/lib/helpers";
import { useColorScheme } from "~/lib/useColorScheme";
import directusStore from "~/store/directus";
import userStore from "~/store/user";
import { File, Message, Room, User } from "~/types";
import * as FileSystem from "expo-file-system";
import { useIsFocused } from "@react-navigation/native";

const FormData = global.FormData;

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

const ChatScreen = ({ roomId, roomAvatar, roomName, receiversId, isGroup }: { roomId: string, roomAvatar: string, roomName: string, receiversId: string[], isGroup: boolean }) => {

    const { rest, token } = directusStore()
    const insets = useSafeAreaInsets()
    const navigator = useNavigation()
    const [ws, setWs] = useState<WebSocket>()
    const { user } = userStore()
    const [messages, setMessages] = useState<ChatMessage<withId | withUri>[]>([])
    const [ready, setReady] = useState(true)
    const [searchBarVisible, setSearchBarVisible] = useState(false)
    const [searchText, setSearchText] = useState("")
    const [scrollToIndex, setScrollToIndex] = useState<number>(0)
    const [debouncedSearchText] = useDebounce(searchText, 500);
    const [page, setPage] = useState(1)
    const { colors } = useColorScheme()
    const [openDropdown, setOpenDropdown] = useState(false)
    const [toUpdateForSent, setToUpdateForSent] = useState<{ id: string }[]>([])
    const [currentMessage, setCurrentMessage] = useState<CurrentMessage>({ text: "" })
    const [notificationSentAlready, setNotificationSentAlready] = useState(false)
    const focused = useIsFocused()
    const fetchInitialMessagesQueryKey = ["Fetch Messages", roomId, focused]

    function handleUpdateReadReceipt(data: InitialDataType) {
        if (data && data.id) {
            setToUpdateForSent(p => [...p, { id: data.id }])
        }
    }

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

    function initializeWebSocket() {
        const ws = new WebSocket(`${directusWSUrl}?access_token=${token}`)
        ws.onopen = () => {
            ws?.send(JSON.stringify({
                type: "subscribe",
                collection: "messages",
                query: {
                    fields: ["*", "user_created.avatar", "user_created.id", "user_created.first_name", "assets.directus_files_id.id", "assets.directus_files_id.type", "assets.directus_files_id.filename_download"],
                    sort: ["-date_created"],
                    filter: {
                        room: {
                            _eq: roomId
                        }
                    }
                }
            }))
            setReady(true)
            setWs(ws)
        }

        ws.addEventListener('message', function (message) {
            const data = JSON.parse(message.data) as { data: InitialDataType | InitialDataType[], type: string, event: string }
            if (data.type === "ping") {
                ws.send(JSON.stringify({ type: "pong" }))
            }
            if (data.type === "subscription" && data.event === "create") {
                let newData: InitialDataType[] = []
                if (Array.isArray(data.data)) {
                    newData = data.data
                } else {
                    newData = [data.data]
                }
                newData = newData.filter(d => d.user_created.id !== user?.id)
                setMessages(p => [
                    ...newData.map(d => ({
                        content: d.content,
                        date_created: d.date_created,
                        id: d.id,
                        room: roomId,
                        sent: true,
                        user_created: {
                            avatar: d.user_created.avatar,
                            id: d.user_created.id,
                            first_name: d.user_created.first_name,
                            last_name: d.user_created.last_name
                        },
                        assets: d.assets?.map(asset => ({
                            id: asset.directus_files_id.id,
                            mimeType: asset.directus_files_id.type,
                            name: asset.directus_files_id.filename_download
                        }))
                    })),
                    ...p])
            } else if (data.type === "items") {
                if (Array.isArray(data.data)) {
                    data.data.forEach(d => {
                        handleUpdateReadReceipt(d)
                    })
                } else {
                    handleUpdateReadReceipt(data.data)
                }
            }
        });

        return () => ws.close()
    }

    const { data: initialMessages, isLoading: isInitialMessagesLoading } = useQuery({
        queryKey: fetchInitialMessagesQueryKey,
        queryFn: async () => await rest.request(readItems("messages", {
            filter: {
                room: {
                    _eq: roomId
                }
            },
            fields: ["*", "user_created.avatar", "user_created.id", "user_created.first_name", "user_created.last_name", "assets.directus_files_id.id", "assets.directus_files_id.type", "assets.directus_files_id.filename_download"],
            sort: ["-date_created"]
        })),
        enabled: !!roomId,
        initialData: []
    }) as {
        data: InitialDataType[], isLoading: boolean
    }

    useEffect(() => {
        navigator.setOptions({
            header: () => <View className="pt-2 flex-col justify-center shadow bg-card" style={{ paddingTop: insets.top + 8 }}>
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
                </View> : <View className="flex-row justify-between items-center mx-2 mb-4 pt-2">
                    <View className="flex-row items-center gap-2">
                        <Image source={{ uri: roomAvatar }} className="w-10 h-10 rounded-full" />
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
        })
    }, [searchBarVisible, searchText, scrollToMessages, scrollToIndex, openDropdown, roomId, roomAvatar, roomName])

    useEffect(() => {
        return initializeWebSocket()
    }, [])

    useEffect(() => {
        if (isInitialMessagesLoading) {
            return
        } else {
            const _initialMessage: ChatMessage<withId>[] = initialMessages.map(message => ({
                content: message.content,
                date_created: message.date_created,
                id: message.id,
                room: roomId,
                sent: true,
                user_created: {
                    avatar: message.user_created.avatar,
                    id: message.user_created.id,
                    first_name: message.user_created.first_name,
                    last_name: message.user_created.last_name
                },
                assets: message.assets.map(asset => ({
                    id: asset.directus_files_id.id,
                    mimeType: asset.directus_files_id.type,
                    name: asset.directus_files_id.filename_download
                }))
            }))
            setMessages(_initialMessage)
            setReady(true)
        }
    }, [roomId, isInitialMessagesLoading])

    useEffect(() => {
        if (toUpdateForSent.length) {
            setMessages(p => p.map(m => {
                if (toUpdateForSent.find(t => t.id === m.id)) {
                    return { ...m, sent: true }
                }
                return m
            }))
            setToUpdateForSent([])
        }
    }, [messages, toUpdateForSent])

    const handleSend = async () => {
        const id = randomUUID()
        const responsePromises: Promise<FileSystem.FileSystemUploadResult>[] = []
        const newFileUriPromises: Promise<string>[] = []
        currentMessage.assets?.forEach(asset => {
            newFileUriPromises.push(getNewFileUrl(asset))
        })
        const newFileUris = await Promise.all(newFileUriPromises)
        currentMessage.assets?.forEach((asset, i) => {
            const response = FileSystem.uploadAsync(`${directusUrl}/files?fields=id`, newFileUris[i]
                , {
                    fieldName: "file",
                    httpMethod: 'POST',
                    uploadType: FileSystem.FileSystemUploadType.MULTIPART,
                    mimeType: asset.mimeType,
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW",
                    },
                    parameters: {
                        "folder": messagesFolderName
                    }
                });
            responsePromises.push(response)
        })
        setMessages(p => [{
            content: currentMessage.text,
            date_created: new Date().toISOString(),
            id,
            room: roomId,
            sent: false,
            user_created: {
                avatar: user?.avatar!,
                id: user?.id!,
                first_name: user?.first_name!,
                last_name: user?.last_name!
            },
            assets: currentMessage.assets
        }, ...p])
        const responses = await Promise.all(responsePromises)
        const fileIds = responses.map(r => {
            const body = JSON.parse(r.body) as { data: { id: string } }
            return body.data.id
        })

        setCurrentMessage({ text: "" })
        ws?.send(JSON.stringify({
            type: 'items',
            collection: 'messages',
            action: 'create',
            data: {
                content: currentMessage.text,
                room: {
                    id: roomId
                },
                id,
                assets: fileIds.length ? fileIds.map(id => ({
                    directus_files_id: {
                        id
                    }
                })) : undefined
            },
            query: {
                fields: ["*", "user_created.avatar", "user_created.id", "user_created.first_name", "assets.directus_files_id.id", "assets.directus_files_id.type", "assets.directus_files_id.filename_download"]
            }
        }));

        if (!notificationSentAlready) {
            await queryClient.fetchQuery({
                queryKey: ["Send notification", receiversId.join(",")],
                queryFn: async () => await rest.request(createNotifications(receiversId.map(id => ({
                    recipient: id,
                    sender: user.id,
                    subject: `New message from ${user.first_name} ${user.last_name}`,
                    message: currentMessage.text || "Open app to view attachment",
                    collection: "directus_users",
                    item: user.id
                }))))
            })
            setNotificationSentAlready(true)
        } else {

        }
    }

    return ready ? <ChatUi
        currentUserId={user?.id!}
        messages={messages}
        goToId={scrollToMessages[scrollToIndex]?.id}
        currentMessage={currentMessage}
        currentMessageDispatcher={setCurrentMessage}
        onSend={handleSend}
        isGroup={isGroup}
    />
        : <View />
}

export default function RoomScreen() {
    const { roomId } = useGlobalSearchParams();
    const { rest } = directusStore()
    const { user } = userStore()
    const [roomDetails, setRoomDetails] = useState<{ roomName: string, roomAvatar: string, receiversId: string[] } | undefined>()

    const { data: room, isLoading } = useQuery({
        queryKey: ["Fetch Room by ID", roomId],
        queryFn: async () => await rest.request(readItem("rooms", roomId as string, {
            fields: ["id", 'type', 'title', 'avatar', 'members.directus_users_id.id', 'members.directus_users_id.first_name', "members.directus_users_id.last_name", 'members.directus_users_id.avatar']
        })),
        enabled: !!roomId && typeof roomId === "string"
    }) as {
        data: Pick<Room, "avatar" | "id" | "type" | "title"> & {
            members: {
                directus_users_id: Pick<User, "avatar" | "first_name" | "last_name" | "id">;
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
        const [roomName, roomAvatar] = room.type === "group"
            ? [room.title!, buildAssetUrl(room.avatar)]
            : [
                `${receiver!.first_name} ${receiver!.last_name}`,
                buildAssetUrl(receiver!.avatar),
            ];
        setRoomDetails({ roomName, roomAvatar, receiversId: room.members.filter(m => m.directus_users_id.id !== user?.id).map(m => m.directus_users_id.id) });
    }, [navigation, room, isLoading]);

    return isLoading ||
        !room?.id || !roomDetails ? (
        <View />
    ) : <ChatScreen
        roomId={roomId as string}
        roomName={roomDetails?.roomName}
        roomAvatar={roomDetails?.roomAvatar}
        receiversId={roomDetails.receiversId}
        isGroup={room.type === "group"}
    />
}