import { Header } from "app/components/header"
import { Text } from "app/components/ui/text"
import { UsersListComponent } from "app/screens/users-list"
import { View } from "react-native"

export const UsersListScreen = () => {
    return <View className="flex-1 flex-col">
        <Header>
            <Text className="font-semibold text-xl">Agents list</Text>
        </Header>
        <UsersListComponent />
    </View>
}