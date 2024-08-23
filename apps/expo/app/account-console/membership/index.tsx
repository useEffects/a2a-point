import { ScrollView } from "app/components/utils/virtual-lists"
import { MembershipApplyScreenComponent } from "app/screens/account-console/membership-apply"

const MembershipScreen = () => {
    return <ScrollView contentContainerClassName="flex-grow">
        <MembershipApplyScreenComponent />
    </ScrollView>
}

export default MembershipScreen