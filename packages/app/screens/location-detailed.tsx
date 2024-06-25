import { MediumListingCardProps } from "app/components/cards/atoms/medium";
import { CommonFilters, RenderListings, bodies, commonFilters } from "app/components/cards/molecules/listings";
import { FullWidthImage } from "app/components/full-width-image";
import { GoToRoomButton } from "app/components/link-buttons";
import { Separator } from "app/components/ui/separator";
import { Text } from "app/components/ui/text";
import { buildAssetUrl } from "app/lib/helpers";
import { Room, User } from "app/lib/types";
import { ArrowUpRight } from "lucide-react-native";
import { useEffect, useState } from "react";
import { Platform, View } from "react-native";
import { FilterKeys } from "./listings";
import { SeparatorText } from "app/components/separator-text";
import { MembersList } from "app/components/cards/molecules/locations";
import { getMembersCountForLocation } from "app/lib/misc/get-counts";
import directusStore from "app/store/directus";

export type LocationListingProps = Pick<Room, "id" | "avatar" | "title"> & {
    members: {
        directus_users_id: Pick<User, "id" | "avatar">
    }[]
}

export function LocationDetailed({ room }: { room: LocationListingProps }) {
    const [totalMembers, setTotalMembers] = useState(0)
    const { authenticated } = directusStore()

    useEffect(() => {
        getMembersCountForLocation(room.id).then(setTotalMembers)
    }, [])

    return <View className="">
        <FullWidthImage source={{ uri: buildAssetUrl(room.avatar) }} />
        <View className="flex-1 p-4 flex-col gap-4">
            <View className="flex-row items-center justify-between">
                <GoToRoomButton disabled={!authenticated} className="flex-row" variant={"default"} size={"sm"} roomId={room.id}>
                    <Text>Open group chat</Text>
                    <ArrowUpRight size={16} className="text-primary-foreground" />
                </GoToRoomButton>
                <MembersList locationId={room.id} members={room.members} total={totalMembers} />
            </View>
            <SeparatorText hideLeft>
                <Text>Leads posted</Text>
            </SeparatorText>
            <RenderListings<MediumListingCardProps>
                render={bodies.medium}
                filter={commonFilters[CommonFilters.GroupId](room.id)}
                flatListProps={{
                    scrollEnabled: Platform.OS === "web",
                    ItemSeparatorComponent: () => <Separator className="my-2" />,
                }}
                paramFilter={{
                    id: room.id,
                    key: FilterKeys.Location,
                }}
            />
        </View>
    </View>
}