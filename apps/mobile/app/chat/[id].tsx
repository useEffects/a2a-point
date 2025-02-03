import { RoomDetailedScreen as RoomDetailedScreenBase } from 'app/screens/room-detailed';
import { useGlobalSearchParams } from 'app/context/router';
import { ScrollView } from 'app/components/utils/virtual-lists';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

function RoomDetailedScreenComponent() {
  const { id } = useGlobalSearchParams();

  return typeof id === 'string' ? (
    <ScrollView contentContainerStyle={{ flex: 1 }}>
      <RoomDetailedScreenBase roomId={id} />
    </ScrollView>
  ) : (
    <></>
  );
}

export default function RoomDetailedScreen() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Room Detailed"
        component={RoomDetailedScreenComponent}
        options={{ header: () => null }}
      />
    </Stack.Navigator>
  );
}
