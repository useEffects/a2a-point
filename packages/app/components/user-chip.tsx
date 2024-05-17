import { Image, Linking, View } from "react-native"
import { Button } from "app/components/ui/button"
import { buildAssetUrl } from "app/lib/helpers"
import { useRouter } from "solito/router"
import { Link } from "solito/link"
import { Text } from "./ui/text"
import opacity from "hex-color-opacity"
import { useColorScheme } from "app/hooks"
import { cn } from "app/lib/utils"

export const UserChip = ({ user, className }: { user: { id: string, avatar: string, first_name: string, last_name: string, email?: string, role?: string }, className?: string }) => {
    const { colors } = useColorScheme()
    const router = useRouter()

    return <Button className={cn("flex-row items-center gap-2 self-start", className)} onPress={() => router.push(`/profile/${user.id}`)} size={"none"} variant={"base"}>
        <View className="flex-row items-center gap-1">
            <Image source={{ uri: buildAssetUrl(user.avatar) }} className="w-6 h-6 rounded-full" />
            <Text className="!text-sm !text-subtext">{user.first_name} {user.last_name}</Text>
        </View>
        {user.email && <Link href={`mailto:${user.email}`} className="!text-subtext !text-xs">{user.email}</Link>}
        <Text className="!text-xs rounded px-1 text-primary" style={{ backgroundColor: opacity(colors.primary, 0.1) }}>Pro</Text>
    </Button>
}