import { Button } from "app/components/ui/button"
import { useColorScheme } from "app/hooks/color-scheme"
import { buildAssetUrl } from "app/lib/helpers"
import { cn } from "app/lib/utils"
import opacity from "hex-color-opacity"
import { Image, View } from "react-native"
import { Link } from "solito/link"
import { useRouter } from "solito/navigation"
import { Text } from "./ui/text"

export const UserChip = ({ user, className }: { user: { id: string, avatar: string, first_name: string, last_name: string, email?: string, role?: string }, className?: string }) => {
    const { colors } = useColorScheme()
    const router = useRouter()

    return <Button className={cn("flex flex-row items-center gap-2", className)} onPress={() => router.push(`/profile/${user.id}`)} size={"none"} variant={"base"}>
        <View className="flex flex-row items-center gap-1">
            <Image source={{ uri: buildAssetUrl(user.avatar) }} className="w-6 h-6 rounded-full" />
            <Text className="!text-sm !text-subtext">{user.first_name} {user.last_name}</Text>
        </View>
        {user.email ? <Link href={`mailto:${user.email}`} className="!text-subtext !text-xs">
            <Text>{user.email}</Text>
        </Link> : <></>}
        <Text className="!text-xs rounded px-1 text-primary" style={{ backgroundColor: opacity(colors.primary, 0.1) }}>Pro</Text>
    </Button>
}