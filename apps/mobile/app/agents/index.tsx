import { useMediumUsersQuery } from 'app/components/cards/utils/users';
import { ScrollView } from 'app/components/utils/virtual-lists';
import { UsersListScreen as UsersListScreenBase } from 'app/screens/users-list';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function AgentsListScreen() {
  const { data } = useMediumUsersQuery();
  const { top } = useSafeAreaInsets();

  return (
    <ScrollView
      contentContainerStyle={{ paddingTop: top }}
    >
      <UsersListScreenBase data={data} />
    </ScrollView>
  );
}
