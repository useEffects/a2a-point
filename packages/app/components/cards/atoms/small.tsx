import { Button } from "app/components/ui/button"
import { Separator } from "app/components/ui/separator"
import { Text } from "app/components/ui/text"
import { LocationChip } from "app/components/utils/chips"
import { useColorScheme } from "app/hooks/color-scheme"
import { buildAssetUrl, timeAgo } from "app/lib/helpers"
import { Listing, Room, User } from "app/lib/types"
import opacity from "hex-color-opacity"
import { Bookmark, ExternalLink, Eye } from "lucide-react-native"
import { Image, Pressable, View } from "react-native"
import { useRouter } from "solito/navigation"
import { useLocalizedCost } from "app/hooks/locale-string"
import { ListingCardMetrics } from "app/lib/props"

export const OpenDetailsButton = ({ id, size = "sm" }: { id: string, size?: "default" | "sm" | "lg" | "icon" | null | undefined }) => {
    const router = useRouter()

    return <Button onPress={() => router.push(`/${id}`)} size={size} variant={"ghost"} className="flex flex-row gap-2 items-center">
        <Text>Details</Text>
        <ExternalLink className="!text-foreground !text-base" />
    </Button>
}

export type SmallListingCardProps = Pick<Listing, "id" | "title" | "budget" | "deal_type" | "tags" | "date_created" | "price"> & { user_created: Pick<User, "id" | "avatar"> } & { location: Pick<Room, "id" | "title" | "avatar"> }

export const RenderMetrics = ({ metrics }: { metrics: ListingCardMetrics }) => {
    const { colors } = useColorScheme()

    return <View className="flex flex-row gap-4">
        {metrics ? <>
            <View className="flex flex-row gap-2 items-center">
                <Eye size={18} color={colors.foreground} />
                <Text>{metrics.views}</Text>
            </View>
            <View className="flex flex-row gap-2 items-center">
                <Bookmark size={18} color={colors.foreground} />
                <Text>{metrics.saves}</Text>
            </View>
        </> : <></>}
    </View>
}

export const SmallListingCard = (item: SmallListingCardProps & ListingCardMetrics) => {
    const { colors } = useColorScheme()
    const router = useRouter()
    const localizedCost = useLocalizedCost(item.deal_type, item.budget, item.price)

    return <Pressable onPress={() => router.push(`/listings/${item.id}`)} className="border-solid border-hairline border-border p-4 flex-row gap-4 bg-card items-start rounded native:w-[400px]">
        <Image source={{ uri: buildAssetUrl(item.user_created.avatar) }} className="w-8 h-8 rounded-full" />
        <View className="flex-col gap-4 flex-1">
            <View className="flex-col gap-1">
                <Text className="text-lg font-semibold text-wrap">{item.title}</Text>
                <View className="flex-row justify-between gap-4 items-center">
                    <Text className="!text-success">AED {localizedCost}</Text>
                    <Text style={{ backgroundColor: opacity(colors.success, 0.1) }} className="text-success px-1 rounded">{item.deal_type}</Text>
                </View>
                {item.tags && <View className="flex-row gap-1 flex-wrap items-center">
                    {item.tags.map((tag, i) => <Text className="text-info text-sm px-1 rounded" style={{ backgroundColor: opacity(colors.info, 0.1) }} key={i}>{tag}</Text>)}
                </View>}
            </View>
            <Separator />
            <View className="flex-row justify-between items-center">
                <RenderMetrics metrics={{ saves: item.saves, views: item.views }} />
                <View className="ml-auto mr-0 flex-col gap-2">
                    <Text className="text-xs text-subtext text-right">Posted {timeAgo.format(new Date(item.date_created))} in</Text>
                    <LocationChip {...item.location} />
                </View>
            </View>
        </View>
    </Pressable>
}