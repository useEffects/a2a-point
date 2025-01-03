import { ScrollView } from "app/components/utils/virtual-lists"
import { PhoneVerificationScreen as PhoneVerificationScreenBase } from "app/screens/account-console/phone"

export default function PhoneVerificationScreen () {
    return <ScrollView contentContainerClassName="flex-grow">
        <PhoneVerificationScreenBase />
    </ScrollView>
}