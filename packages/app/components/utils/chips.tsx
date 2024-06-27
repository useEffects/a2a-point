import { Room } from "app/lib/types"
import { Image, Pressable } from "react-native"
import { Text } from "../ui/text"
import { buildAssetUrl } from "app/lib/helpers"
import useRouting from "app/hooks/use-routing"

export const LocationChip = ({ avatar, id, title }: Pick<Room, "id" | "title" | "avatar">) => {
    const goToLocation = useRouting("location-detailed")
    return <Pressable onPress={() => goToLocation(id as any)} className="flex-row gap-2 items-center rounded justify-start self-start">
        <Image source={{ uri: buildAssetUrl(avatar) }} className="w-6 h-6 rounded-full" />
        <Text>{title}</Text>
    </Pressable>
}