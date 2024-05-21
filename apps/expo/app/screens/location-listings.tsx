import { Header } from "app/components/header";
import { Text } from "app/components/ui/text";
import { Image, ScrollView, View, } from "react-native";
import { useParams } from "solito/navigation"
import { useQuery } from "@tanstack/react-query"
import directusStore from "app/store/directus";
import { readItem } from "@directus/sdk";
import { Room, User } from "app/lib/types";
import { buildAssetUrl } from "app/lib/helpers";
import { FullWidthImage } from "app/components/full-width-image"
import Collapsible from "react-native-collapsible";
import { FlatList } from "react-native-gesture-handler";
import { GoToProfileButton, GoToRoomButton } from "app/components/utils";
import { ArrowUpRight } from "lucide-react-native";
import { useColorScheme } from "app/hooks/color-scheme";
import { useState } from "react";
import { CommonFilters, RenderListings, bodies, commonFilters } from "app/components/listings-cards/molecules/listings";
import { MediumListingCardProps } from "app/components/listings-cards/atoms/medium";
import { useDebounce } from "use-debounce";
import SearchBar from "app/components/searchbar";
import { Separator } from "app/components/ui/separator";

const RenderUserAvatar = ({ id, avatar }: { id: string, avatar: string }) => {
    return <GoToProfileButton userId={id} className="rounded-full">
        <Image source={{ uri: buildAssetUrl(avatar) }} className="w-16 h-16 rounded-full" />
    </GoToProfileButton>
}

export default function LocationListings() {
    const params = useParams<{ id: string }>()
    const { rest } = directusStore()
    const { colors } = useColorScheme()
    const [searchText, setSearchText] = useState("")
    const [debouncedSearchText] = useDebounce(searchText, 500)

    const { data: room } = useQuery({
        queryKey: ["Fetching full details for room", params.id],
        queryFn: async () => await rest.request(readItem("rooms", params.id, {
            fields: ["id", "title", "avatar", "members.directus_users_id.id", "members.directus_users_id.avatar"]
        })),
        enabled: Boolean(params.id)
    }) as {
        data: Pick<Room, "id" | "avatar" | "title"> & {
            members: {
                directus_users_id: Pick<User, "id" | "avatar">
            }[]
        }
    }

    if (!params?.id || !room) {
        return <></>
    }

    return <ScrollView>
        <Header>
            <Text className="text-xl font-bold">{room.title}</Text>
        </Header>
        <Collapsible collapsed={false}>
            <FullWidthImage source={{ uri: buildAssetUrl(room.avatar) }} />
            <View className="p-4 flex-col gap-4">
                <View className="flex-row justify-between">
                    <Text className="text-lg font-bold">{room.members.length} members</Text>
                    <GoToRoomButton roomId={room.id} variant={"outline"} size={"sm"} className="flex-row border-info">
                        <Text className="text-info">Open group chat</Text>
                        <ArrowUpRight size={16} color={colors.info} />
                    </GoToRoomButton>
                </View>
                <FlatList
                    data={room.members.map((m => ({ id: m.directus_users_id.id, avatar: m.directus_users_id.avatar })))}
                    renderItem={({ item }) => <RenderUserAvatar {...item} />}
                    horizontal={true}
                    ItemSeparatorComponent={() => <View className="h-4 w-4" />}
                />
            </View>
        </Collapsible>
        <Separator className="my-4" />
        <View className="flex-col gap-4 px-4">
            <Text className="">Browse Listings</Text>
            <SearchBar
                searchText={searchText}
                setSearchText={setSearchText}
            />
            <RenderListings<MediumListingCardProps>
                render={bodies.medium}
                filterMethod={commonFilters[CommonFilters.GroupId](room.id)}
                searchText={debouncedSearchText}
                flatListProps={{
                    scrollEnabled: false
                }}
            />
        </View>
    </ScrollView>
}