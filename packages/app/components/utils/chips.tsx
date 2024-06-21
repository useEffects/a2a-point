import { Room } from "app/lib/types"
import { GoToLocationListingsButton } from "../link-buttons"
import { Image } from "react-native"
import { Text } from "../ui/text"
import { buildAssetUrl } from "app/lib/helpers"

export const LocationChip = ({ avatar, id, title }: Pick<Room, "id" | "title" | "avatar">) => {
    return <GoToLocationListingsButton roomId={id} className="flex-row gap-2 items-center rounded justify-start self-start">
        <Image source={{ uri: buildAssetUrl(avatar) }} className="w-6 h-6 rounded-full" />
        <Text>{title}</Text>
    </GoToLocationListingsButton>
}