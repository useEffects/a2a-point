import { ScrollView } from "app/components/utils/virtual-lists"
import { PremiumCreditsScreenComponent } from "app/screens/account-console/premium-credits"

const PremiumCreditsScreen = () => {
    return <ScrollView contentContainerClassName="flex-grow">
        <PremiumCreditsScreenComponent />
    </ScrollView>
}

export default PremiumCreditsScreen