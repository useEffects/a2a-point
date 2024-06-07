import { MediumListingCardProps } from "app/components/cards/atoms/medium";
import { CommonFilters, RenderListings, bodies, commonFilters } from "app/components/cards/molecules/listings";
import { FullWidthImage } from "app/components/full-width-image";
import { GoToProfileButton, GoToRoomButton } from "app/components/link-buttons";
import SearchBar from "app/components/searchbar";
import { Separator } from "app/components/ui/separator";
import { Text } from "app/components/ui/text";
import { useColorScheme } from "app/hooks/color-scheme";
import { buildAssetUrl } from "app/lib/helpers";
import { Room, User } from "app/lib/types";
import { ArrowUpRight } from "lucide-react-native";
import { useState } from "react";
import { Image, Platform, View } from "react-native";
import Collapsible from "react-native-collapsible";
import { FlatList } from "react-native-gesture-handler";
import { useDebounce } from "use-debounce";

const RenderUserAvatar = ({ id, avatar }: { id: string, avatar: string }) => {
    return <GoToProfileButton userId={id} className="rounded-full">
        <Image source={{ uri: buildAssetUrl(avatar) }} className="w-16 h-16 rounded-full" />
    </GoToProfileButton>
}

export type LocationListingProps = Pick<Room, "id" | "avatar" | "title"> & {
    members: {
        directus_users_id: Pick<User, "id" | "avatar">
    }[]
}

export function LocationDetailed({ room }: { room: LocationListingProps }) {
    const { colors } = useColorScheme()
    const [searchText, setSearchText] = useState("")
    const [debouncedSearchText] = useDebounce(searchText, 500)

    return <View>
        <Collapsible collapsed={false}>
            <FullWidthImage source={{ uri: buildAssetUrl(room.avatar) }} />
            <View className="p-4 flex-col gap-4">
                <View className="flex-row justify-between">
                    <Text className="text-lg font-bold">{room.members.length} members</Text>
                    <GoToRoomButton roomId={room.id} variant={"outline"} size={"sm"} className="flex-row">
                        <Text>Open group chat</Text>
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
                    scrollEnabled: Platform.OS === "web",
                }}
            />
        </View>
    </View>
}