import { ScrollView } from "app/components/utils/virtual-lists"
import { MembershipApplyScreenComponent } from "app/screens/account-console/membership-apply"
import { View } from "react-native"

export const MembershipScreen = () => {
    return <View className="flex-1">
        <ScrollView contentContainerClassName="p-4 flex-grow">
            <MembershipApplyScreenComponent />
        </ScrollView>
    </View>
}