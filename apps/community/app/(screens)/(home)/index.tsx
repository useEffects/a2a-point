import { readItems } from "@directus/sdk";
import { useQuery } from "@tanstack/react-query";
import { FlatList, Platform, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { SmallListCard, SmallListCardProps } from "~/components/listings-cards/molecules/small";
import { Text } from "~/components/ui/text";
import directusStore from "~/store/directus";
import { Feather } from '@expo/vector-icons';
import { Button } from "~/components/ui/button";
import { router } from "expo-router";

const LocationCards = () => {
    return <View>

    </View>
}

export default function Home() {
    const insets = useSafeAreaInsets();
    const { rest } = directusStore();

    const { data: latestListings, isLoading: isLatestListingsLoading } = useQuery({
        queryKey: ["latest-listings"],
        queryFn: async () => await rest.request(readItems("listings", {
            fields: ["id", "title", "price", "address", "type", "user_created.id", "user_created.avatar"],
            limit: 5,
            sort: ["-date_created"],
        })),
        initialData: [],
    })

    const { data: featuredListings } = useQuery({
        queryKey: ["featured-listings"],
        queryFn: async () => await rest.request(readItems("listings", {
            fields: ["id", "title", "price", "address", "type", "user_created.id", "user_created.avatar"],
            limit: 5,
            sort: ["-date_created"],
            filter: {
                featured: {
                    _eq: true
                }
            }
        })),
        initialData: [],
    })

    return <View style={{ paddingTop: insets.top }} className="w-full container p-4 flex-col gap-12">
        <View className="mt-4 flex-col gap-4">
            <View className="flex flex-row items-center justify-between">
                <Text className="text-xl">Latest</Text>
                <Button size={"sm"} variant={"ghost"} className="flex-row items-center">
                    <Text className="">View All</Text>
                    <Feather name="arrow-right" className="!text-foreground !text-base ml-2" />
                </Button>
            </View>
            <FlatList
                horizontal={true}
                scrollEnabled={true}
                showsHorizontalScrollIndicator={Platform.OS === "web" ? true : false}
                data={latestListings}
                renderItem={({ item }) => <SmallListCard {...item as SmallListCardProps} />}
                ItemSeparatorComponent={() => <View className="w-4" />}
            />
        </View>
        <View className="flex-col gap-4">
            <View className="flex flex-row items-center justify-between">
                <Text className="text-xl">Featured</Text>
                <Button onPress={() => router.navigate("/discover")} size={"sm"} variant={"ghost"} className="flex-row items-center">
                    <Text className="">View All</Text>
                    <Feather name="arrow-right" className="!text-foreground !text-base ml-2" />
                </Button>
            </View>
            <FlatList
                horizontal={true}
                scrollEnabled={true}
                showsHorizontalScrollIndicator={Platform.OS === "web" ? true : false}
                data={featuredListings}
                renderItem={({ item }) => <SmallListCard {...item as SmallListCardProps} />}
                ItemSeparatorComponent={() => <View className="w-4" />}
            />
        </View>
    </View>
}