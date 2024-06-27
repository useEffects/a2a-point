import { useColorScheme } from "app/hooks/color-scheme"
import { buildAssetUrl, isUserPro } from "app/lib/helpers"
import { cn } from "app/lib/utils"
import opacity from "hex-color-opacity"
import { Image, Pressable, View } from "react-native"
import { Link } from "solito/link"
import { Text } from "./ui/text"
import { User } from "app/lib/types"
import useRouting from "app/hooks/use-routing"

export const UserChip = ({ user, className }: { user: Pick<User, "id" | "first_name" | "last_name" | "plan" | "avatar"> & { email?: string }, className?: string }) => {
    const isPro = isUserPro(user.plan)
    const goToProfile = useRouting("profile-detailed")

    return <Pressable onPress={() => goToProfile(user.id)} className={cn("flex flex-row items-center gap-2", className)}>
        <View className="flex flex-row items-center gap-1">
            <Image source={{ uri: buildAssetUrl(user.avatar) }} className="w-6 h-6 rounded-full" />
            <Text className="!text-sm !text-subtext !font-normal">{user.first_name} {user.last_name}</Text>
        </View>
        {user.email ? <Link href={`mailto:${user.email}`}>
            <Text className="!text-subtext !text-xs">{user.email}</Text>
        </Link> : <></>}
        {isPro && <Text className="text-xs rounded px-1 text-primary bg-primary/10">Pro</Text>}
    </Pressable>
}