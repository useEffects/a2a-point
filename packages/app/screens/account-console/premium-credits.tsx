import { Header, HeaderTitle } from "app/components/header"
import { Button } from "app/components/ui/button"
import { Text } from "app/components/ui/text"
import { View } from "react-native"
import * as Linking from "expo-linking"
import { portfolioUrl, products, ProductType } from "app/lib/constants"
import userStore from "app/store/user"

export const PremiumCreditsScreenComponent = () => {
    const { user } = userStore()
    const handleBuyPremiumCredits = () => {
        const premiumProductListing = products.find(p => p.productType === ProductType.premiumListingsQuota)!
        Linking.openURL(`${portfolioUrl}/api/pay/${premiumProductListing.stripeCode}/?user_id=${user.id}&isMobile=true`)
    }
    return <View className="gap-12 flex-col flex-1">
        <Header>
            <HeaderTitle>Premium credits</HeaderTitle>
        </Header>
        <View className="flex-grow p-4 flex-col gap-12 justify-between">
            <Text>Premium credits enable you to have your listings featured as premium listings!</Text>
            <Button onPress={handleBuyPremiumCredits}>
                <Text>Buy premium credit</Text>
            </Button>
        </View>
    </View>
}