import { Image, View } from "react-native";
import { Advertisement, User } from "app/lib/types";
import { Text } from "app/components/ui/text";
import { buildAssetUrl, getDMRoomId, shortTime } from "app/lib/helpers";
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
            {/* <View className="absolute top-auto right-4 left-auto bottom-4 flex-row gap-4">
                <Button size="icon" className="bg-background" onPress={async () => router.navigate(`/chat/${await getDMRoomId([user.id, props.user_created.id])}`)}>
                    <MaterialIcons size={18} name="chat" className="!text-foreground" />
                </Button>
                <Button size="icon" className="bg-background" onPress={() => router.navigate(`/profile/${props.user_created.id}`)}>
                    <MaterialIcons size={18} name="person" className="!text-foreground" />
                </Button>
            </View> */}
        </View>
        <Text className="text-sm">{props.caption}</Text>
        <Text className="text-xs text-subtext">{shortTime(props.date_created)}</Text>
    </View >
}