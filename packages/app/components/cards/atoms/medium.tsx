import { UserChip } from "app/components/user-chip"
import { getDMRoomId, shortString, timeAgo } from "app/lib/helpers"
import { Listing, Room, User } from "app/lib/types"
import userStore from "app/store/user"
import { MessageCircleMore, Lock } from "lucide-react-native"
import { Button } from "../../ui/button"
import { Text } from "../../ui/text"
import { RenderMetrics } from "./small"
import { View } from "react-native"
import { useColorScheme } from "app/hooks/color-scheme"
import directusStore from "app/store/directus"
import { GoToFullListingButton, GoToRoomButton } from "app/components/link-buttons"

export type MediumListingCardProps = Pick<Listing, "id" | "title" | "price" | "type" | "deal_type" | "description" | "date_created"> & { user_created: Pick<User, "id" | "avatar" | "first_name" | "last_name" | "email"> } & { group: Pick<Room, "id" | "title" | "avatar"> }

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

    return <View className="w-full flex-col gap-2 px-2 my-8">
        <View className="flex flex-wrap gap-4 flex-row items-center justify-between">
            <UserChip user={item.user_created} />
            {authenticated ? user.id === item.user_created.id ? <></> : <GoToRoomButton roomId={getDMRoomId([user.id, item.user_created.id])}>
                <MessageCircleMore className="!text-foreground" />
            </GoToRoomButton> : <LockedChatButton />}
        </View>
        <GoToFullListingButton listingId={item.id} className="items-start" size={"none"} variant={"base"}>
            <Text className="text-lg text-primary">{item.title}</Text>
            <View className="flex-col gap-1 bg-card rounded-2xl p-4 mt-2 w-full">
                <View className="flex-row justify-between">
                    <Text className="text-success">AED {Number(item.price).toLocaleString()}</Text>
                    <View className="flex-row gap-2">
                        <Text className="text-info">{item.deal_type}</Text>
                        <Text className="text-subtext">|</Text>
                        <Text className="text-primary">{item.type}</Text>
                    </View>
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