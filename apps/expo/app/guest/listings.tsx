import { View } from "react-native"

export default function GuestFullListingScreen({ route }) {
    const params = route.params
    if (!params.id) {
        return <></>
    }
    return <View>
    </View>
}