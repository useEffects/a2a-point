import { ScrollView } from "app/components/utils/virtual-lists"
import { CompanySelectScreenComponent } from "app/screens/account-console/company-select"
import { View } from "react-native"

export const CompanySelectScreen = () => {
    return <View className="flex-1">
        <ScrollView contentContainerClassName="p-4 flex-grow">
            <CompanySelectScreenComponent />
        </ScrollView>
    </View>
}