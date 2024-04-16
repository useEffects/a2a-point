import { Feather, MaterialIcons } from '@expo/vector-icons';
import { IconProps } from "@expo/vector-icons/build/createIconSet";
import { Href, HrefObject, router } from "expo-router";
import { ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { CommonFilters, RenderListings, bodies, commonFilters } from "~/components/listings-cards/body/listings";
import { LocationCards } from "~/components/listings-cards/body/locations";
import { ExtraSmallListingCardProps } from "~/components/listings-cards/molecules/extra-small";
import { MediumListingCardProps } from "~/components/listings-cards/molecules/medium";
import { SmallListingCardProps } from "~/components/listings-cards/molecules/small";
import { Button } from "~/components/ui/button";
import { Hr } from "~/components/ui/hr";
import { Text } from "~/components/ui/text";

const categoryTiles = [
    {
        icon: (props?: Omit<IconProps<string>, "name">) => <MaterialIcons name="workspace-premium" {...props} />,
        label: "Premium"
    }, {
        icon: (props?: Omit<IconProps<string>, "name">) => <MaterialIcons name="auto-graph" {...props} />,
        label: "Listing"
    }, {

        icon: (props?: Omit<IconProps<string>, "name">) => <MaterialIcons name="newspaper" {...props} />,
        label: "Enquiry"
    }, {

        icon: (props?: Omit<IconProps<string>, "name">) => <MaterialIcons name="sell" {...props} />,
        label: "Sale"
    }, {
        icon: (props?: Omit<IconProps<string>, "name">) => <MaterialIcons name="house" {...props} />,
        label: "Buy"
    }, {
        icon: (props?: Omit<IconProps<string>, "name">) => <MaterialIcons name="savings" {...props} />,
        label: "Rent"
    }
]

const CategoryTile = ({ icon, label }: { icon: (props?: Omit<IconProps<string>, "name">) => JSX.Element, label: string }) => {
    return <View className="flex-col items-center gap-1">
        <Button className="rounded-full" size={"icon"} variant={"outline"}>
            {icon({ className: "!text-foreground", size: 18 })}
        </Button>
        <Text className="text-subtext text-sm">{label}</Text>
    </View>
}

const CardsHeader = ({ route, label }: { route?: HrefObject<any, any> | Href<string>, label?: string }) => <View className="flex flex-row items-center justify-between md:gap-12 md:justify-start">
    {label && <Text className="md:w-[200px] text-light text-subtext text-sm">{label}</Text>}
    {route && <Button onPress={() => router.navigate(route)} size={"sm"} variant={"ghost"} className="flex-row items-center">
        <Text className="!text-sm">View All</Text>
        <Feather name="arrow-right" className="!text-foreground !text-base ml-2" />
    </Button>}
</View>

export default function Home() {
    const insets = useSafeAreaInsets();
    return <ScrollView className="w-full">
        <View style={{ paddingTop: insets.top }} className="bg-card" />
        <View className="container flex-col gap-4 pb-6">
            <View className="p-4 bg-card flex-col gap-6">
                <CardsHeader label="Browse Categories" />
                <View className="flex-row justify-between">
                    {categoryTiles.map((categoryTile, index) => <CategoryTile key={index} {...categoryTile} />)}
                </View>
                <Button onPress={() => router.navigate("/discover")} size={"sm"} className="flex-row gap-2 justify-center items-enter" variant={"outline"}>
                    <MaterialIcons name="category" size={18} className="!text-foreground" />
                    <Text className="!text-sm">Browse all listings</Text>
                </Button>
            </View>
            <View className="flex-col gap-4 p-4">
                <LocationCards />
            </View>
            <View className="flex-col gap-4 bg-card p-4 flex-1">
                <CardsHeader route={{ pathname: "/discover", params: { filter: CommonFilters.ViewedByMe } }} label="Continue browsing" />
                <RenderListings<ExtraSmallListingCardProps> render={bodies.extraSmall} filterMethod={commonFilters[CommonFilters.ViewedByMe]()} flatListProps={{ scrollEnabled: false }} />
            </View>
            <View className="flex-col gap-4 p-4">
                <CardsHeader label="Featured" route={{ pathname: "/discover", params: { filter: CommonFilters.Featured } }} />
                <RenderListings<SmallListingCardProps> render={bodies.small} filterMethod={commonFilters[CommonFilters.Featured]()} flatListProps={{ horizontal: true }} />
            </View>
            <View className="flex-col gap-4 p-4">
                <CardsHeader label="Latest" route="/discover" />
                <RenderListings<MediumListingCardProps> render={bodies.medium} flatListProps={{ scrollEnabled: false, ItemSeparatorComponent: () => <Hr className="my-4" /> }} />
            </View>
        </View>
    </ScrollView>
}