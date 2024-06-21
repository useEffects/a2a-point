import { createItem, createNotifications, readItem, readItems } from "@directus/sdk";
import { Dispatch, ReactNode, SetStateAction, createContext, useContext, useEffect, useState } from "react";
import { Platform } from "react-native";
import { Asset, ChatMessage, withId, withUri } from "app/components/chat-ui";
import { directusUrl, directusWSUrl, messagesFolderName } from "app/lib/constants";
import directusStore, { MyDirectusClient } from "app/store/directus";
import userStore from "app/store/user";
import { File, Message, Room, User } from "app/lib/types";
import { useQueryClient } from "@tanstack/react-query";
import { queryClient } from "app/store/query";
import * as FileSystem from "expo-file-system";
import { fileUpload } from "app/lib/file-upload";

const roomsSubscribedQueryKey = ["Subscribed Rooms"]

export const chatFields = ["*", "user_created.avatar", "user_created.id", "user_created.first_name", "user_created.last_name", "assets.directus_files_id.id", "assets.directus_files_id.type", "assets.directus_files_id.filename_download"]

export const roomSubscribedFields = ["*", "members.directus_users_id.avatar", "members.directus_users_id.first_name", "members.directus_users_id.last_name", "members.directus_users_id.id"]

export const limit = 30

export type MessageDetailed = Pick<Message, "id" | "room" | "content" | "date_created"> &
{ user_created: Pick<User, "id" | "first_name" | "avatar" | "last_name"> } &
{
    assets: { directus_files_id: Pick<File, "id" | "type" | "filename_download"> }[]
}

export type Member = {
    directus_users_id: Pick<User, "id" | "avatar" | "first_name" | "last_name">;
}

export type RoomSubscribed = Pick<Room, "avatar" | "id" | "type" | "title"> & {
    members: Member[];
};

export const ChatsContext = createContext<{
    setMessage: (message: ChatMessage<withUri>) => void,
    addRoom: (roomId: string) => Promise<RoomSubscribed | null>,
    roomsSubscribed: RoomSubscribed[],
    messages: ChatMessage<withId | withUri>[],
    loadMoreMessages: (offset: number, roomId: string) => Promise<boolean>
}>({
    setMessage: () => { },
    addRoom: () => Promise.resolve(null),
    roomsSubscribed: [],
    messages: [],
    loadMoreMessages: () => Promise.resolve(false)
})

export const ChatsProvider = ({ children, rest, token }: { children: ReactNode, rest: MyDirectusClient, token: string }) => {
    const { user } = userStore()
    const [ws, setWs] = useState<WebSocket | null>(null)
    const [messages, setMessages] = useState<ChatMessage<withId | withUri>[]>([])
    const [sentNotifications, setSentNotifications] = useState<{ [key: string]: boolean }>({})
    const [roomsSubscribed, setRoomsSubscribed] = useState<RoomSubscribed[]>([])
    const queryClient = useQueryClient()

    function initializeWebSocket() {
        const ws = new WebSocket(`${directusWSUrl}?access_token=${token}`)
        ws.onopen = () => {
            ws?.send(JSON.stringify({
                type: "subscribe",
                collection: "messages",
                query: {
                    limit: 0,
                    fields: chatFields
                }
            }))
            console.log("WebSocket connection established")
        }
        ws?.addEventListener("message", (message) => {
            const data = JSON.parse(message.data) as { event: string, type: string, data: MessageDetailed[] }
            if (data.type === "subscription" && data.event === "create") {
                data.data.forEach(message => {
                    if (message.user_created.id === user.id) {
                        setMessages(messages => messages.map(m => m.id === message.id ? { ...m, sent: true } : m))
                        if (!sentNotifications[message.room]) {
                            const members = roomsSubscribed?.find(room => room.id === message.room)?.members
                            const recipients = members?.filter(member => member.directus_users_id.id !== user.id).map(member => member.directus_users_id.id) ?? []
                            sendNotification(message, recipients)
                            setSentNotifications(notifications => ({ ...notifications, [message.id]: true }))
                        }
                    } else {
                        setMessages(messages => [transformMessage(message), ...messages])
                    }
                })
            }
            if (data.type == "ping") {
                ws?.send(JSON.stringify({ type: "pong" }))
            }
        })
        return ws
    }

    useEffect(() => {
        roomsSubscribed.forEach(async roomSubscribed => {
            const data = await queryClient.fetchQuery({
                queryKey: ["Fetching Messages For", roomSubscribed.id],
                queryFn: async () => await rest.request(readItems("messages", {
                    filter: {
                        room: {
                            _eq: roomSubscribed.id
                        }
                    },
                    fields: chatFields,
                    limit: limit,
                    sort: ["-date_created"]
                }))
            }) as MessageDetailed[] | undefined
            if (data) {
                setMessages(messages => [...data.map(message => transformMessage(message, true)), ...messages])
            }
        })
        console.log("here")
        const _ws = initializeWebSocket()
        setWs(_ws)
        return () => {
            if (typeof _ws?.close === "function") {
                _ws.close()
            }
        }
    }, [roomsSubscribed])

    useEffect(() => {
        async function sendMessages() {
            const unsentMessages = messages.filter(m => !m.sent) as ChatMessage<withUri>[]
            unsentMessages.forEach(async message => {
                const fileIds = await Promise.all(message.assets?.map(asset => fileUpload(asset, messagesFolderName)) ?? [])
                const payload = {
                    id: message.id,
                    content: message.content,
                    room: {
                        id: message.room
                    },
                    assets: fileIds.length ? fileIds.map(id => ({
                        "directus_files_id": id,
                    })) : undefined
                }
                ws?.send(JSON.stringify({
                    type: "items",
                    collection: "messages",
                    action: "create",
                    data: payload,
                    query: {
                        fields: chatFields
                    }
                }))
            })
        }
        sendMessages()
    }, [messages])

    useEffect(() => {
        async function initializeRoomSubscribed() {
            const data = await queryClient.fetchQuery({
                queryKey: roomsSubscribedQueryKey,
                queryFn: async () => await rest.request(readItems("rooms", {
                    filter: {
                        members: {
                            directus_users_id: {
                                _eq: user.id
                            }
                        }
                    },
                    fields: roomSubscribedFields
                }))
            }) as RoomSubscribed[] | undefined
            setRoomsSubscribed(data ?? [])
        }
        initializeRoomSubscribed()
    }, [])

    return <ChatsContext.Provider value={{
        setMessage: (message: ChatMessage<withUri>) => setMessages(messages => [message, ...messages]),
        addRoom: (roomId: string) => _setRoomsSubscribed(setRoomsSubscribed, roomsSubscribed, roomId),
        roomsSubscribed: roomsSubscribed,
        messages: messages,
        loadMoreMessages: async (offset: number, roomId: string) => {
            const data = await queryClient.fetchQuery({
                queryKey: ["Fetching Messages For", roomId, offset],
                queryFn: async () => await rest.request(readItems("messages", {
                    filter: {
                        room: {
                            _eq: roomId
                        }
                    },
                    fields: chatFields,
                    limit: limit,
                    offset: offset * limit,
                    sort: ["-date_created"]
                }))
            }) as MessageDetailed[]
            if (data.length) {
                setMessages(messages => [...messages, ...data.map(message => transformMessage(message, true))])
                return true
            }
            return false
        }
    }}>
        {children}
    </ChatsContext.Provider>
}

function transformMessage(message: MessageDetailed, sent?: boolean): ChatMessage<withId | withUri> {
    return {
        id: message.id,
        content: message.content,
        date_created: message.date_created,
        room: message.room,
        sent: sent ?? false,
        user_created: message.user_created,
        assets: message.assets.map(asset => ({
            id: asset.directus_files_id.id,
            mimeType: asset.directus_files_id.type,
            name: asset.directus_files_id.filename_download
        }))
    }
}

async function sendNotification(message: MessageDetailed, recipients: string[]) {
    const { rest } = directusStore.getState()
    const { user } = userStore.getState()

    await rest.request(createNotifications(recipients.map(recipient => ({
        recipient: recipient,
        sender: user.id,
        subject: `New message from ${user.first_name} ${user.last_name}`,
        message: message.content || "Open app to view attachment",
        collection: "directus_users",
        item: user.id
    }))))
}

async function _setRoomsSubscribed(setRoomsSubscribed: Dispatch<SetStateAction<RoomSubscribed[]>>, prevRooms: RoomSubscribed[], roomId: string): Promise<RoomSubscribed | null> {
    const found = prevRooms.find(room => room.id === roomId)
    if (!found) {
        const { rest } = directusStore.getState()
        try {
            const createRoomRes = await queryClient.fetchQuery({
                queryKey: ["Add user to room", roomId],
                queryFn: async () => await rest.request(createItem("rooms_directus_users", {
                    rooms_id: roomId,
                    directus_users_id: userStore.getState().user?.id
                })),
            })
            if (!createRoomRes) return null
            const room = await queryClient.fetchQuery({
                queryKey: ["Fetch Room", roomId],
                queryFn: async () => await rest.request(readItem("rooms", roomId, {
                    fields: roomSubscribedFields
                })),
            }) as RoomSubscribed
            console.log({ room })
            setRoomsSubscribed(rooms => [room, ...rooms])
            queryClient.setQueryData(roomsSubscribedQueryKey, (rooms: RoomSubscribed[]) => [room, ...rooms])
            return room
        } catch (error) {
            return null
        }
    } else return found
}