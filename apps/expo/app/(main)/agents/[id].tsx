import { useMediumUsersQuery } from "app/components/cards/utils/users"
import { UsersListComponent } from "app/screens/users-list"

export default function AgentDetailedScreen() {
    const { data } = useMediumUsersQuery()

    return <UsersListComponent data={data} />
}