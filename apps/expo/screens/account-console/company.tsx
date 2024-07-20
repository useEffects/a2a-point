import { ScrollView } from "app/components/utils/virtual-lists"
import { CompanySelectScreenComponent } from "app/screens/account-console/company-select"
import { View } from "react-native"

export const CompanySelectScreen = () => {
    return <ScrollView contentContainerClassName="flex-1">
        <CompanySelectScreenComponent />
    </ScrollView>
}