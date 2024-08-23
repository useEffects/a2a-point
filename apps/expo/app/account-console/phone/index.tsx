import { ScrollView } from "app/components/utils/virtual-lists"
import { PhoneVerificationScreenComponent } from "app/screens/account-console/phone"

const PhoneVerificationScreen = () => {
    return <ScrollView contentContainerClassName="flex-grow">
        <PhoneVerificationScreenComponent />
    </ScrollView>
}

export default PhoneVerificationScreen