import { ScrollView } from "app/components/utils/virtual-lists"
import { PhoneVerificationScreenComponent } from "app/screens/account-console/phone"
import { View } from "react-native"

export const PhoneVerificationScreen = () => {
    return <View className="flex-1">
        <ScrollView contentContainerClassName="p-4 flex-grow">
            <PhoneVerificationScreenComponent />
        </ScrollView>
    </View>
}