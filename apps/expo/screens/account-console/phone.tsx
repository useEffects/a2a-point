import { Header } from "app/components/header"
import { Text } from "app/components/ui/text"
import { ScrollView } from "app/components/utils/virtual-lists"
import { PhoneVerificationScreenComponent } from "app/screens/account-console/phone"
import { View } from "react-native"

export const PhoneVerificationScreen = () => {
    return <View className="flex-1">
        <Header>
            <Text className="text-xl font-semibold">Phone number verification</Text>
        </Header>
        <ScrollView contentContainerClassName="p-4 flex-grow">
            <PhoneVerificationScreenComponent />
        </ScrollView>
    </View>
}