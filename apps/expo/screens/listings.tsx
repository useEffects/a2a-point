import { Header } from "app/components/header"
import { Text } from "app/components/ui/text"
import { GoToPostButtonUi } from "app/components/utils/common-ui"
import ListingsScreenComponent from "app/screens/listings"
import { View } from "react-native"

const ListingsScreen = () => {
    return (
        <View className="flex-1 flex-col">
            <Header className="items-center py-4" height={"auto"}>
                <View className="flex-row flex-1 justify-between items-center">
                    <Text className="text-xl font-semibold">Listings</Text>
                    <GoToPostButtonUi />
                </View>
            </Header>
            <ListingsScreenComponent />
        </View>
    )
}

export default ListingsScreen