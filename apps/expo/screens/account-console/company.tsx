import { Header } from "app/components/header"
import { Text } from "app/components/ui/text"
import { ScrollView } from "app/components/utils/virtual-lists"
import { CompanySelectScreenComponent } from "app/screens/account-console/company-select"
import { View } from "react-native"

export const CompanySelectScreen = () => {
    return <View className="flex-1">
        <Header>
            <Text className="text-xl font-bold">Company select</Text>
        </Header>
        <ScrollView contentContainerClassName="p-4 flex-grow">
            <CompanySelectScreenComponent />
        </ScrollView>
    </View>
}