import { Header } from "app/components/header"
import { Text } from "app/components/ui/text"
import ListingsScreenComponent from "app/screens/listings"
import { View } from "react-native"

const ListingsScreen = () => {
    return (
        <View className="flex-1 flex-col">
            <Header className="items-center py-4" height={"auto"}>
                <Text className="text-xl font-bold">A2APoint</Text>
            </Header>
            <ListingsScreenComponent />
        </View>
    )
}

export default ListingsScreen