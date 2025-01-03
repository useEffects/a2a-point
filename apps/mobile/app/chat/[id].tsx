import { RoomDetailedScreen as RoomDetailedScreenBase } from 'app/screens/room-detailed';
import { useGlobalSearchParams } from 'app/context/router';
import { ScrollView } from 'app/components/utils/virtual-lists';

export default function RoomDetailedScreen() {
  const { id } = useGlobalSearchParams();

  return typeof id === 'string' ? (
    <ScrollView>
      <RoomDetailedScreenBase roomId={id} />
    </ScrollView>
  ) : (
    <></>
  );
}
