import { Header } from "app/components/header"
import { Text } from "app/components/ui/text"
import { ScrollView } from "app/components/utils/virtual-lists"
import { MembershipApplyScreenComponent } from "app/screens/account-console/membership-apply"
import { View } from "react-native"

export const MembershipScreen = () => {
    return <View className="flex-1">
        <Header>
            <Text className="text-xl font-bold">Membership</Text>
        </Header>
        <ScrollView contentContainerClassName="p-4 flex-grow">
            <MembershipApplyScreenComponent />
        </ScrollView>
    </View>
}