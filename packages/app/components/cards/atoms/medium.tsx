import { UserChip } from "app/components/user-chip"
import { getDMRoomId, shortString, timeAgo } from "app/lib/helpers"
import { Listing, Room, User } from "app/lib/types"
import userStore from "app/store/user"
import { MessageCircleMore, Lock, Edit, Trash } from "app/components/icons"
import { Button } from "../../ui/button"
import { Text } from "../../ui/text"
import { RenderMetrics } from "./small"
import { Pressable, View } from "react-native"
import { useColorScheme } from "app/hooks/color-scheme"
import directusStore from "app/store/directus"
import { LocationChip } from "app/components/utils/chips"
import useRouting from "app/hooks/use-routing"
import { useLocaleString } from "app/hooks/locale-string"
import { ListingCardMetrics } from "app/lib/props"

export type MediumListingCardProps = Pick<Listing, "id" | "title" | "budget" | "deal_type" | "description" | "date_created"> & { user_created: Pick<User, "id" | "avatar" | "first_name" | "last_name" | "email" | "plan"> } & { location: Pick<Room, "id" | "title" | "avatar"> }

export const LockedChatButton = () => {
    const { colors } = useColorScheme()
    return <Button variant={"base"} size={"none"} className="flex-row gap-1 items-center bg-muted border border-muted-foreground py-[2px] px-1 rounded">
        <Text className="text-muted-foreground text-sm">chat</Text>
        <Lock size={14} color={colors["muted-foreground"]} />
    </Button>
}

export const MediumListingCard = (item: MediumListingCardProps & ListingCardMetrics) => {
    const { user } = userStore()
    const { authenticated } = directusStore()
    const goToRoom = useRouting("room-detailed")
    const goToListingDetailed = useRouting("listing-detailed")
    const localizedBudget = useLocaleString(item.budget)

    return <View className="w-full flex-col gap-2 p-4 my-8">
        <View className="flex flex-wrap gap-4 flex-row items-center justify-between">
            <UserChip user={item.user_created} />
            {authenticated ? user.id === item.user_created.id ? <></> : <Pressable onPress={() => getDMRoomId([item.user_created.id, user.id]).then(id => goToRoom(id))}>
                <MessageCircleMore className="!text-foreground" />
            </Pressable> : <LockedChatButton />}
        </View>
        <Pressable onPress={() => goToListingDetailed(item.id)} className="items-start flex-col gap-2 w-full">
            <Text className="!text-lg text-primary">{item.title}</Text>
            <View className="flex-row justify-between w-full">
                <LocationChip {...item.location} />
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
                    <Text className="text-success">AED {localizedBudget}</Text>
                    <Text className="text-primary capitalize">{item.deal_type}</Text>
                </View>
                <Text>{shortString(item.description, 150)}</Text>
            </View>
        </Pressable>
        <View className="m-0 p-0 px-2 flex-row justify-between w-full items-center">
            <RenderMetrics metrics={{ saves: item.saves, views: item.views }} />
            <Text className="text-xs text-subtext">{timeAgo.format(new Date(item.date_created))}</Text>
        </View>
    </View>
}