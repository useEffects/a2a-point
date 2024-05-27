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
import HomeScreenComponent from "app/screens/home"

export const HomeScreen = () => {
    const [collapsed, setCollapsed] = useState(false)
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
            <View className="p-4">
                <Collapsible duration={500} collapsed={collapsed}>
                    <View className="flex-col gap-8 py-4">
                        <Button variant={"base"} size={"none"} className="flex-row gap-1 items-center w-40 ml-auto mr-0">
                            <Text className="text-right text-subtext">Premium listings curated by A2APoint</Text>
                            <ArrowUpRight size={24} color={colors.info} />
                        </Button>
                        <RenderListings<SmallListingCardProps>
                            render={bodies.small}
                            flatListProps={{
                                horizontal: true,
                            }}
                        />
                        <View className="flex-col gap-2">
                            <Text className="text-subtext">Browse popular locations</Text>
                            <LocationCards />
                        </View>
                        <Separator />
                        <View className="">
                            <Text className="text-2xl font-medium">Let&apos;s search your next lead!</Text>
                        </View>
                    </View>
                </Collapsible>
                <HomeScreenComponent setCollapsed={setCollapsed} />
            </View>
        </ScrollView>
    )
}