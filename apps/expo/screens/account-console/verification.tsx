import { Header } from "app/components/header"
import { Text } from "app/components/ui/text"
import { ScrollView } from "app/components/utils/virtual-lists"
import { VerificationApplyScreenComponent } from "app/screens/account-console/verification-apply"
import { View } from "react-native"

export const VerificationScreen = () => {
    return <View className="flex-1">
        <Header>
            <Text className="text-xl font-semibold">Verification</Text>
        </Header>
        <ScrollView contentContainerClassName="p-4 flex-grow">
            <VerificationApplyScreenComponent />
        </ScrollView>
    </View>
}