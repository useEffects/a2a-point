import { Stacked } from '../../components/stacked';
import { useMediumUsersQuery } from 'app/components/cards/utils/users';
import {
  UsersListScreen as UsersListScreenBase,
  UsersListScreenHeader,
} from 'app/screens/agents';

export default function AgentsListScreenComponent() {
  const { data } = useMediumUsersQuery();

  return (
    <Stacked header={() => <UsersListScreenHeader />}>
      <UsersListScreenBase data={data} />
    </Stacked>
  );
}
