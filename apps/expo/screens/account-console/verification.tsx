import { Header } from "app/components/header"
import { Text } from "app/components/ui/text"
import { ScrollView } from "app/components/utils/virtual-lists"
import { View } from "react-native"
import { VerificationApplyScreenComponent } from "app/screens/account-console/verification-apply"

export const VerificationScreen = () => {
    return <View className="flex-1">
        <Header>
            <Text className="text-xl font-bold">Verification</Text>
        </Header>
        <ScrollView contentContainerClassName="p-4 flex-grow">
            <VerificationApplyScreenComponent />
        </ScrollView>
    </View>
}