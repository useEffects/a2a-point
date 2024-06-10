import { Header } from "app/components/header"
import { Text } from "app/components/ui/text"
import { View } from "react-native"
import { LocationsList } from "app/screens/locations-list"

export const LocationsListScreen = () => {
    return <View className="flex-1">
        <Header>
            <Text>Locations list</Text>
        </Header>
        <LocationsList />
    </View>
}