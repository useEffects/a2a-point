import { Image } from "react-native"
import { Button } from "./ui/button"
import { buildAssetUrl } from "~/lib/helpers"
import { router } from "expo-router"
import { Text } from "./ui/text"

export const UserChip = ({ user }: { user: { id: string, avatar: string, first_name: string, last_name: string } }) => {
    return <Button className="!px-0 !py-0 flex-row items-center gap-1 w-auto h-6" onPress={() => router.push(`/profile/${user.id}`)} size={"icon"} variant={"link"}>
        <Image source={{ uri: buildAssetUrl(user.avatar) }} className="w-6 h-6 rounded-full" />
        <Text className="!text-sm !text-subtext">{user.first_name} {user.last_name}</Text>
    </Button>
}