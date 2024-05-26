import { Header } from "app/components/header"
import { SmallListingCardProps } from "app/components/listings-cards/atoms/small"
import { CommonFilters, RenderListings, bodies } from "app/components/listings-cards/molecules/listings"
import { LocationCards } from "app/components/listings-cards/molecules/locations"
import { Button } from "app/components/ui/button"
import { Separator } from "app/components/ui/separator"
import { Text } from "app/components/ui/text"
import { useColorScheme } from "app/hooks/color-scheme"
import userStore from "app/store/user"
import { ArrowUpRight, LucideProps } from "lucide-react-native"
import { useState } from "react"
import { ScrollView, View } from "react-native"
import Collapsible from "react-native-collapsible"
import { Award, Sparkles, CreditCard, Home } from "lucide-react-native"
import HomeScreenComponent from "app/screens/home"

export const HomeScreen = () => {
    const { user } = userStore()
    const [collapsed, setCollapsed] = useState(false)
    const { colors } = useColorScheme()

    return (
        <ScrollView
            alwaysBounceHorizontal={false}
            alwaysBounceVertical={false}
            bounces={false}
            overScrollMode={"never"}
            className="flex-1 flex-col gap-8">
            <Header className="items-center py-4" height={"auto"}>
                <View className="flex-row justify-between flex-1">
                    <View>
                        <Text className="text-subtext">Welcome back,</Text>
                        <Text className="text-lg text-success">{user.first_name} {user.last_name}</Text>
                    </View>
                </View>
            </Header>
            <Collapsible duration={500} collapsed={collapsed}>
                <View className="flex-col pt-8 pb-4 gap-8">
                    <Button variant={"base"} size={"none"} className="flex-row gap-1 items-center">
                        <Text className="text-right w-40 ml-auto mr-0 text-subtext">Premium listings curated by A2APoint</Text>
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
            <HomeScreenComponent />
        </ScrollView>
    )
}