import RoomDetailedComponent from "app/screens/room-detailed"
import { useParams } from "solito/navigation"

export default function RoomDetailed() {
    const { id } = useParams<{ id: string }>()
    return <RoomDetailedComponent roomId={id} />
}