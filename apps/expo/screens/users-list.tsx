import { useMediumUsersQuery } from "app/components/cards/utils/users"
import { UsersListComponent } from "app/screens/users-list"
import { View } from "react-native"

export const UsersListScreen = () => {
    const { data } = useMediumUsersQuery()

    return <View className="flex-1">
        <UsersListComponent data={data} />
    </View>
}