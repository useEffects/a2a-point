import { router } from "
import { View } from "react-native"
import { getDMRoomId, shortString } from "app/lib/helpers"
import { Listing, User } from "app/lib/types"
import { Text } from "../../ui/text"
import { Button } from "../../ui/button"
import { MaterialIcons } from '@expo/vector-icons';
import { RenderMetrics } from "./small"
import userStore from "app/store/user"
import { UserChip } from "app/components/user-chip"

export type MediumListingCardProps = Pick<Listing, "id" | "title" | "price" | "address" | "type" | "deal_type" | "description"> & { user_created: Pick<User, "id" | "avatar" | "first_name" | "last_name" | "email"> }

export const MediumListingCard = (item: MediumListingCardProps) => {
    const { user } = userStore()

    return <View className="w-full flex-col gap-2 px-2 my-6">
        <View className="flex flex-row items-center justify-between">
            <UserChip user={item.user_created} />
            {user.id === item.user_created.id ? <></> : <Button size="none" variant="base" onPress={async () => router.push(`/chat/${await getDMRoomId([user.id, item.user_created.id])}`)}>
                <MaterialIcons size={18} name="chat" className="!text-foreground" />
            </Button>}
        </View>
        <Button className="items-start" onPress={() => router.push(`/${item.id}`)} size={"none"} variant={"base"}>
            <Text className="text-lg text-primary">{item.title}</Text>
            <View className="flex-col gap-1 bg-card rounded-2xl p-4 mt-2 w-full">
                <Text className="text-subtext">{item.address}</Text>
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
        </Button>
        <View className="m-0 p-0 px-2">
            <RenderMetrics listingId={item.id} />
        </View>
    </View>
}