import RoomDetailedComponent from "app/screens/room-detailed";
import { useParams } from "solito/navigation";

export default function RoomDetailedScreen() {
    const { id } = useParams()

    return typeof id === "string" ? <RoomDetailedComponent roomId={id} /> : <></>
}

