"use client"

import ChatScreenComponent from "app/screens/chat"
import { useParams } from "next/navigation"
import RoomDetailedComponent from "app/screens/room-detailed"
import directusStore from "app/store/directus"
import { Separator } from "app/components/ui/separator"
import { useIsSmallDevice } from "app/hooks/is-small-device"

export default function Page() {
    const isSmallDevice = useIsSmallDevice()
    const { authenticated } = directusStore()
    return isSmallDevice ? <ChatScreenComponent /> : authenticated && <div className="flex justify-center items-center">
        <div>
            <p>Click on a box to start chatting</p>
        </div>
    </div>
}