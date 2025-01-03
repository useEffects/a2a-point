import { useMediumUsersQuery } from 'app/components/cards/utils/users';
import { ScrollView } from 'app/components/utils/virtual-lists';
import { UsersListScreen as UsersListScreenBase } from 'app/screens/users-list';

export default function AgentsListScreen() {
  const { data } = useMediumUsersQuery();

  return (
    <ScrollView>
      <UsersListScreenBase data={data} />
    </ScrollView>
  );
}
