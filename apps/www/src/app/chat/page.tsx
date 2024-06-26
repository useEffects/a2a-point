"use client"

import ChatScreenComponent from "app/screens/chat"
import { useParams } from "next/navigation"
import RoomDetailedComponent from "app/screens/room-detailed"
import directusStore from "app/store/directus"
import { Separator } from "app/components/ui/separator"
import ChatsProvider from "app/components/providers/chats"
import { useIsSmallDevice } from "app/hooks/is-small-device"

function ChatScreen() {
    const { room } = useParams()
    const { authenticated } = directusStore()

    return authenticated ? <div className="container flex h-screen">
        <div className="w-1/3 h-full">
            <ChatScreenComponent />
        </div>
        <Separator orientation="vertical" />
        <div className="w-2/3 bg-card h-full p-4">
            {room.length === 2 ? <RoomDetailedComponent roomId={room[1]} /> : <div>
            </div>}
        </div>
    </div> : <></>
}

export default function Page() {
    const isSmallDevice = useIsSmallDevice()
    return isSmallDevice ? <ChatScreenComponent /> : <div>
    </div>
}