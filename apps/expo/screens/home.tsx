import { Header } from "app/components/header"
import { SmallListingCardProps } from "app/components/listings-cards/atoms/small"
import { RenderListings, bodies } from "app/components/listings-cards/molecules/listings"
import { LocationCards } from "app/components/listings-cards/molecules/locations"
import { Button } from "app/components/ui/button"
import { Separator } from "app/components/ui/separator"
import { Text } from "app/components/ui/text"
import { useColorScheme } from "app/hooks/color-scheme"
import { ArrowUpRight } from "lucide-react-native"
import { useState } from "react"
import { ScrollView, View } from "react-native"
import Collapsible from "react-native-collapsible"
import { LoginPopover, HomeScreenComponent } from "app/screens/home"
import directusStore from "app/store/directus"

export const HomeScreen = () => {
    const [collapsed, setCollapsed] = useState(false)
    const { authenticated } = directusStore()
    const { colors } = useColorScheme()

    return (
        <ScrollView
            alwaysBounceHorizontal={false}
            alwaysBounceVertical={false}
            bounces={false}
            overScrollMode={"never"}
            className="flex-1 flex-col gap-8"
        >
            <Header className="items-center py-4" height={"auto"}>
                <Text className="text-xl font-bold">A2APoint</Text>
            </Header>
            <HomeScreenComponent />
        </ScrollView>
    )
}