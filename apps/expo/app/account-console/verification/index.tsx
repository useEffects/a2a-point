import { Header } from "app/components/header"
import { Text } from "app/components/ui/text"
import { ScrollView } from "app/components/utils/virtual-lists"
import { VerificationApplyScreenComponent } from "app/screens/account-console/verification-apply"
import { View } from "react-native"

const VerificationScreen = () => {
    return <ScrollView contentContainerClassName="flex-grow">
        <VerificationApplyScreenComponent />
    </ScrollView>
}

export default VerificationScreen