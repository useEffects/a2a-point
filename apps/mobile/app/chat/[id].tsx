import { RoomDetailedScreen as RoomDetailedScreenBase } from 'app/screens/room-detailed';
import { useGlobalSearchParams } from 'app/context/router';
import { Stacked } from '../../components/stacked';

export default function RoomDetailedScreenComponent() {
  const { id } = useGlobalSearchParams();

  return typeof id === 'string' ? (
    <Stacked header={() => null}>
      <RoomDetailedScreenBase roomId={id} />
    </Stacked>
  ) : (
    <></>
  );
}
