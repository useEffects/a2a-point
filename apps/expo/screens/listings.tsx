import { Header } from "app/components/header"
import { GoToPostButton } from "app/components/link-buttons"
import { Text } from "app/components/ui/text"
import ListingsScreenComponent from "app/screens/listings"
import { View } from "react-native"
import { Plus } from "app/components/icons"
import { GoToPostButtonUi } from "app/components/utils/common-ui"

const ListingsScreen = () => {
    return (
        <View className="flex-1 flex-col">
            <Header className="items-center py-4" height={"auto"}>
                <View className="flex-row flex-1 justify-between items-center">
                    <Text className="text-xl font-bold">Listings</Text>
                    <GoToPostButtonUi />
                </View>
            </Header>
            <ListingsScreenComponent />
        </View>
    )
}

export default ListingsScreen