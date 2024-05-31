import { Image, View } from "react-native";
import { Advertisement, User } from "app/lib/types";
import { Text } from "app/components/ui/text";
import { buildAssetUrl, getDMRoomId, shortTime, timeAgo } from "app/lib/helpers";
import userStore from "app/store/user";
import { UserChip } from "app/components/user-chip";

export type AdvertisementCardProps = Pick<Advertisement, "id" | "caption" | "title" | "photo" | "date_created"> & { user_created: Pick<User, "id" | "first_name" | "last_name" | "email" | "avatar"> }

export const AdvertisementCard = (props: AdvertisementCardProps) => {
    const { user } = userStore()

    return <View className="flex-col gap-2 bg-card px-2 py-6">
        <View className="flex-row justify-between items-center">
            <UserChip user={props.user_created} />
            <Text className="text-xs text-subtext">Promoted</Text>
        </View>
        <Text className="text-lg">{props.title}</Text>
        <View className="">
            <Image source={{ uri: buildAssetUrl(props.photo) }} />
        </View>
        <Text className="text-sm">{props.caption}</Text>
        <Text className="text-xs text-subtext">{timeAgo.format(new Date(props.date_created))}</Text>
    </View >
}