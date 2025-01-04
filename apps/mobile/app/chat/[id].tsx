import { RoomDetailedScreen as RoomDetailedScreenBase } from 'app/screens/room-detailed';
import { useGlobalSearchParams } from 'app/context/router';
import { ScrollView } from 'app/components/utils/virtual-lists';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function RoomDetailedScreen() {
  const { id } = useGlobalSearchParams();
  const { top, bottom } = useSafeAreaInsets();

  return typeof id === 'string' ? (
    <ScrollView
      contentContainerStyle={{ paddingTop: top, flex: 1 }}
    >
      <RoomDetailedScreenBase roomId={id} />
    </ScrollView>
  ) : (
    <></>
  );
}
