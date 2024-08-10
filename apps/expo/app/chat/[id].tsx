import RoomDetailedComponent from "app/screens/room-detailed";
import { useParams } from "solito/navigation";
import PadBottom from "../../components/pad-bottom";

export default function RoomDetailedScreen() {
    const { id } = useParams()

    return typeof id === "string" ?
        <PadBottom>
            <RoomDetailedComponent roomId={id} />
        </PadBottom>
        : <></>
}

