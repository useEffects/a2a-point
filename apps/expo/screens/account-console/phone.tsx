import { ScrollView } from "app/components/utils/virtual-lists"
import { PhoneVerificationScreenComponent } from "app/screens/account-console/phone"

export const PhoneVerificationScreen = () => {
    return <ScrollView contentContainerClassName="flex-1">
        <PhoneVerificationScreenComponent />
    </ScrollView>
}