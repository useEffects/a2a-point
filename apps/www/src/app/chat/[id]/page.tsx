"use client"

import RoomDetailedComponent from "app/screens/room-detailed"
import { useParams } from "next/navigation"

export default function RoomDetailed() {
    const { id } = useParams()
    return <RoomDetailedComponent roomId={id as string} />
}