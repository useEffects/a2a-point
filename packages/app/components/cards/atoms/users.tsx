import { buildAssetUrl } from "app/lib/helpers"
import { User } from "app/lib/types"
import { Image, View } from "react-native"

export type SmallUsersCardProps = Pick<User, "id" | "avatar" | "first_name" | "last_name" | "computed_rating" | "rating_count">

export const smallUsersFields = ["id", "avatar", "first_name", "last_name", "computed_rating", "rating_count"]

export const SmallUsersCard = (item: SmallUsersCardProps) => {
    return <View>
        <Image className="rounded-full w-16 h-16" source={{ uri: buildAssetUrl(item.avatar) }} />
        <View>

        </View>
    </View>
}