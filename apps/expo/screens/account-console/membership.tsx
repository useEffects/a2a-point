import { ScrollView } from "app/components/utils/virtual-lists"
import { MembershipApplyScreenComponent } from "app/screens/account-console/membership-apply"
import { View } from "react-native"

export const MembershipScreen = () => {
    return <ScrollView contentContainerClassName="flex-1">
        <MembershipApplyScreenComponent />
    </ScrollView>
}