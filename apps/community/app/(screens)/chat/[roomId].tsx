import { readItem, readItems, uploadFiles } from "@directus/sdk";
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
import { directusUrl, directusWSUrl } from "~/lib/constants";
import { buildAssetUrl, searchBarContainerStyle, searchBarInputContainerStyle, uriToBlob } from "~/lib/helpers";
import { useColorScheme } from "~/lib/useColorScheme";
import directusStore from "~/store/directus";
import userStore from "~/store/user";
import { File, Message, Room, User } from "~/types";
import * as FileSystem from "expo-file-system";

const FormData = global.FormData;

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

const ChatScreen = ({ roomId, roomAvatar, roomName }: { roomId: string, roomAvatar: string, roomName: string }) => {
    const fetchInitialMessagesQueryKey = ["Fetch Messages", roomId]

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

    function handleUpdateReadReceipt(props: { data: ChatMessage<withId>, type: string }) {
        const { data, type } = props
        if (type === "items" && data && data.id) {
            queryClient.setQueryData(fetchInitialMessagesQueryKey, (prev: ChatMessage<withId>[]) => [...prev, data].sort((a, b) => new Date(b.date_created).getTime() - new Date(a.date_created).getTime()))
            setToUpdateForSent(p => [...p, { id: data.id }])
        }
    }

    function subscribe() {
        ws?.send(JSON.stringify({
            type: "subscribe",
            collection: "messages",
            query: {
                fields: ["*", "user_created.avatar", "user_created.id"]
            }
        }))
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
        enabled: !!debouncedSearchText,
        initialData: [],
        staleTime: 0
    }) as { data: { id: string }[], isLoading: boolean }

    function initializeWebSocket() {
        const ws = new WebSocket(`${directusWSUrl}?access_token=${token}`)
        ws.onopen = () => {
            setReady(true)
            setWs(ws)
            subscribe()
        }
        ws.addEventListener('open', function () {
        });

        ws.addEventListener('message', function (message) {
            const data = JSON.parse(message.data)
            handleUpdateReadReceipt(data)
        });

        ws.addEventListener('close', function () {
        });

        ws.addEventListener('error', function (error) {
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
            fields: ["*", "user_created.avatar", "user_created.id", "user_created.first_name", "assets.directus_files_id.id", "assets.directus_files_id.type", "assets.directus_files_id.filename_download"],
            sort: ["-date_created"]
        })),
        enabled: !!roomId
    }) as {
        data: (Omit<Message, "assets"> & {
            user_created: Pick<User, "avatar" | "id" | "first_name">
        } & {
            assets: {
                directus_files_id: Pick<File, "id" | "type" | "filename_download">
            }[]
        }
        )[], isLoading: boolean
    }

    useEffect(() => {
        navigator.setOptions({
            header: () => <View className="pt-2 flex-col justify-center h-24 shadow bg-card" style={{ paddingTop: insets.top + 8 }}>
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
    }, [searchBarVisible, searchText, scrollToMessages, scrollToIndex, openDropdown])

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
        currentMessage.assets?.forEach(asset => {
            const response = FileSystem.uploadAsync(`${directusUrl}/files?fields=id`, asset.uri, {
                fieldName: 'file',
                httpMethod: 'POST',
                uploadType: FileSystem.FileSystemUploadType.MULTIPART,
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW",
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
            },
            assets: currentMessage.assets
        }, ...p])
        const responses = await Promise.all(responsePromises)
        const fileIds = responses.map(r => {
            const body = JSON.parse(r.body) as { data: { id: string } }
            console.log(body)
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
                fields: ["*", "user_created.avatar", "user_created.id"]
            }
        }));
    }

    return ready ? <ChatUi
        currentUserId={user?.id!}
        messages={messages}
        goToId={scrollToMessages[scrollToIndex]?.id}
        currentMessage={currentMessage}
        currentMessageDispatcher={setCurrentMessage}
        onSend={handleSend}
    />
        : <View />
}

export default function RoomScreen() {
    const { roomId } = useGlobalSearchParams();
    const { rest } = directusStore()
    const { user } = userStore()
    const [roomDetails, setRoomDetails] = useState<{ roomName: string, roomAvatar: string } | undefined>()

    const { data: room, isLoading } = useQuery({
        queryKey: ["Fetch Room by ID", roomId],
        queryFn: async () => await rest.request(readItem("rooms", roomId as string, {
            fields: ["id", 'isGroup', 'title', 'avatar', 'members.directus_users_id.id', 'members.directus_users_id.first_name', "members.directus_users_id.last_name", 'members.directus_users_id.avatar']
        })),
        enabled: !!roomId && typeof roomId === "string"
    }) as {
        data: Pick<Room, "avatar" | "id" | "isGroup" | "title"> & {
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
        const [roomName, roomAvatar] = room.isGroup
            ? [room.title!, buildAssetUrl(room.avatar)]
            : [
                `${receiver!.first_name} ${receiver!.last_name}`,
                buildAssetUrl(receiver!.avatar),
            ];
        setRoomDetails({ roomName, roomAvatar });
    }, [navigation, room, isLoading]);

    return isLoading ||
        !room?.id || !roomDetails ? (
        <View />
    ) : <ChatScreen roomId={roomId as string} roomName={roomDetails?.roomName} roomAvatar={roomDetails?.roomAvatar} />
}