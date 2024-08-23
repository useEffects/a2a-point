import { ScrollView } from "app/components/utils/virtual-lists"
import { CompanySelectScreenComponent } from "app/screens/account-console/company-select"

const CompanySelectScreen = () => {
    return <ScrollView contentContainerClassName="flex-grow">
        <CompanySelectScreenComponent />
    </ScrollView>
}

export default CompanySelectScreen