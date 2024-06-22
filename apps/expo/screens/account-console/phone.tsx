import { Header } from "app/components/header"
import { Text } from "app/components/ui/text"
import { ScrollView } from "app/components/utils/virtual-lists"
import { View } from "react-native"
import { PhoneVerificationScreenComponent } from "app/screens/account-console/phone"

export const PhoneVerificationScreen = () => {
    return <View className="flex-1">
        <Header>
            <Text className="text-xl font-bold">Phone number verification</Text>
        </Header>
        <ScrollView contentContainerClassName="p-4 flex-grow">
            <PhoneVerificationScreenComponent />
        </ScrollView>
    </View>
}