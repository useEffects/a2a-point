import { Header } from "app/components/header"
import { Text } from "app/components/ui/text"
import { View } from "react-native"
import { UsersListComponent } from "app/screens/users-list"

export const UsersListScreen = () => {
    return <View className="flex-1 flex-col">
        <Header>
            <Text>Agents list</Text>
        </Header>
        <UsersListComponent />
    </View>
}