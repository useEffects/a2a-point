import { readItems } from "@directus/sdk";
import { useQuery } from "@tanstack/react-query";
import { FlatList, Platform, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { SmallListCard, SmallListCardProps } from "~/components/listings-cards/molecules/small";
import { Text } from "~/components/ui/text";
import directusStore from "~/store/directus";
import { Feather } from '@expo/vector-icons';
import { Button } from "~/components/ui/button";

const LocationCards = () => {
    return <View>

    </View>
}

export default function Home() {
    const insets = useSafeAreaInsets();
    const { rest } = directusStore();

    const { data: featuredLists } = useQuery({
        queryKey: ["featured-lists"],
        queryFn: async () => await rest.request(readItems("listings", {
            fields: ["id", "title", "price", "location", "user_created.id", "user_created.avatar"],
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
        <View className="mt-4">
            <View className="flex flex-row items-center justify-between">
                <Text className="text-xl">Trending</Text>
                <Button size={"sm"} variant={"ghost"} className="flex-row items-center">
                    <Text className="">View All</Text>
                    <Feather name="arrow-right" className="!text-foreground !text-base ml-2" />
                </Button>
            </View>
            <FlatList
                horizontal={true}
                scrollEnabled={true}
                showsHorizontalScrollIndicator={Platform.OS === "web" ? true : false}
                data={featuredLists}
                renderItem={({ item }) => SmallListCard(item as SmallListCardProps)}
                ItemSeparatorComponent={() => <View className="w-4" />}
            />
        </View>
        <View>
            <View className="flex flex-row items-center justify-between">
                <Text className="text-xl">Featured</Text>
                <Button size={"sm"} variant={"ghost"} className="flex-row items-center">
                    <Text className="">View All</Text>
                    <Feather name="arrow-right" className="!text-foreground !text-base ml-2" />
                </Button>
            </View>
            <FlatList
                horizontal={true}
                scrollEnabled={true}
                showsHorizontalScrollIndicator={Platform.OS === "web" ? true : false}
                data={featuredLists}
                renderItem={({ item }) => SmallListCard(item as SmallListCardProps)}
                ItemSeparatorComponent={() => <View className="w-4" />}
            />
        </View>
    </View>
}