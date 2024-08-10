import { useMediumUsersQuery } from "app/components/cards/utils/users"
import { UsersListComponent } from "app/screens/users-list"
import PadBottom from "../../components/pad-bottom"

export default function AgentsListScreen() {
    const { data } = useMediumUsersQuery()

    return <PadBottom>
        <UsersListComponent data={data} />
    </PadBottom>
}