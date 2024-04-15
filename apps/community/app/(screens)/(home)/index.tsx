import { readItems } from "@directus/sdk";
import { useQuery } from "@tanstack/react-query";
import { FlatList, Platform, ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { SmallListingCard, SmallListingCardProps } from "~/components/listings-cards/molecules/small";
import { Text } from "~/components/ui/text";
import directusStore from "~/store/directus";
import { Feather } from '@expo/vector-icons';
import { Button } from "~/components/ui/button";
import { router } from "expo-router";
import { RenderListings, bodies, commonFilters } from "~/components/listings-cards/body";
import { ExtraSmallListingCardProps } from "~/components/listings-cards/molecules/extra-small";

const LocationCards = () => {
    return <View>

    </View>
}

const CardsHeader = ({ route, label }: { route: string, label: string }) => <View className="flex flex-row items-center justify-between md:gap-12 md:justify-start my-4">
    <Text className="text-xl md:w-[200px]">{label}</Text>
    <Button onPress={() => router.navigate(`${route}`)} size={"sm"} variant={"ghost"} className="flex-row items-center">
        <Text className="">View All</Text>
        <Feather name="arrow-right" className="!text-foreground !text-base ml-2" />
    </Button>
</View>

export default function Home() {
    const insets = useSafeAreaInsets();

    return <ScrollView style={{ paddingTop: insets.top }} className="w-full container p-4 flex-col gap-12">
        <View className="flex-col gap-4">
            <CardsHeader route="/discover" label="Continue browsing" />
            <RenderListings<ExtraSmallListingCardProps> render={bodies.extraSmall} flatListProps={{ scrollEnabled: false }} />
        </View>
        <View className="flex-col gap-4">
            <CardsHeader label="Latest" route="/discover" />
            <RenderListings<SmallListingCardProps> render={bodies.small} filter={commonFilters.filterFeatured} flatListProps={{ horizontal: true }} />
        </View>
        <View className="flex-col gap-4">
            <CardsHeader label="Featured" route="/discover" />
            <RenderListings<SmallListingCardProps> render={bodies.small} filter={commonFilters.filterFeatured} flatListProps={{ horizontal: true }} />
        </View>
    </ScrollView>
}