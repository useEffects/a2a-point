import { UserChip } from "app/components/user-chip"
import { getDMRoomId, shortString, timeAgo } from "app/lib/helpers"
import { Listing, Room, User } from "app/lib/types"
import userStore from "app/store/user"
import { MessageCircleMore, Lock, Edit, Trash } from "app/components/icons"
import { Button } from "../../ui/button"
import { Text } from "../../ui/text"
import { RenderMetrics } from "./small"
import { View } from "react-native"
import { useColorScheme } from "app/hooks/color-scheme"
import directusStore from "app/store/directus"
import { GoToFullListingButton, GoToRoomButton } from "app/components/link-buttons"
import { LocationChip } from "app/components/utils/chips"
import { directusUrl } from "app/lib/constants"
import * as Linking from 'expo-linking';

export type MediumListingCardProps = Pick<Listing, "id" | "title" | "price" | "deal_type" | "description" | "date_created"> & { user_created: Pick<User, "id" | "avatar" | "first_name" | "last_name" | "email" | "plan"> } & { group: Pick<Room, "id" | "title" | "avatar"> }

export const LockedChatButton = () => {
    const { colors } = useColorScheme()
    return <Button variant={"base"} size={"none"} className="flex-row gap-1 items-center bg-muted border border-muted-foreground py-[2px] px-1 rounded">
        <Text className="text-muted-foreground text-sm">chat</Text>
        <Lock size={14} color={colors["muted-foreground"]} />
    </Button>
}

export const MediumListingCard = (item: MediumListingCardProps) => {
    const { user } = userStore()
    const { authenticated } = directusStore()
    const directusLocationUrl = `${directusUrl}/admin/contents/listings/${item.id}`

    return <View className="w-full flex-col gap-2 px-2 my-8">
        <View className="flex flex-wrap gap-4 flex-row items-center justify-between">
            <UserChip user={item.user_created} />
            {authenticated ? user.id === item.user_created.id ? <></> : <GoToRoomButton roomId={getDMRoomId([user.id, item.user_created.id])}>
                <MessageCircleMore className="!text-foreground" />
            </GoToRoomButton> : <LockedChatButton />}
        </View>
        <GoToFullListingButton listingId={item.id} className="items-start flex-col gap-2 w-full" size={"none"} variant={"base"}>
            <Text className="text-lg text-primary">{item.title}</Text>
            <View className="flex-row justify-between w-full">
                <LocationChip {...item.group} />
                {user.id === item.user_created.id && <View className="flex-row gap-4">
                    <Button variant={"base"} size={"none"}>
                        <Edit size={18} className="text-info" />
                    </Button>
                    <Button variant={"base"} size={"none"}>
                        <Trash size={18} className="text-destructive" />
                    </Button>
                </View>}
            </View>
            <View className="flex-col gap-1 bg-card rounded-2xl p-4 mt-2 w-full">
                <View className="flex-row justify-between">
                    <Text className="text-success">AED {Number(item.price).toLocaleString()}</Text>
                    <Text className="text-primary">{item.deal_type}</Text>
                </View>
                <Text>{shortString(item.description, 150)}</Text>
            </View>
        </GoToFullListingButton>
        <View className="m-0 p-0 px-2 flex-row justify-between w-full items-center">
            <RenderMetrics listingId={item.id} />
            <Text className="text-xs text-subtext">{timeAgo.format(new Date(item.date_created))}</Text>
        </View>
    </View>
}