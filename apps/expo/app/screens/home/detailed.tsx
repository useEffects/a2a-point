import { View } from "react-native"
import { RouteProp } from "@react-navigation/native"

export default function FullListingScreen({ route }: { route: RouteProp<any> }) {
    const params = route.params
    if (!params?.id) {
        return <></>
    }
    return <View>
    </View>
}