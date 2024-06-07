import { Button } from "app/components/ui/button"
import { Text } from "app/components/ui/text"
import { useIsFocused } from "app/hooks/is-focused"
import { buildAssetUrl, getListingMetrics } from "app/lib/helpers"
import { Listing, User } from "app/lib/types"
import { Bookmark, ExternalLink, Eye } from "lucide-react-native"
import { useEffect, useState } from "react"
import { Image, View } from "react-native"
import { useRouter } from "solito/navigation"
import { ListingCardMetrics } from "./full"
import { useColorScheme } from "app/hooks/color-scheme"
import { GoToFullListingButton } from "app/components/link-buttons"

export const OpenDetailsButton = ({ id, size = "sm" }: { id: string, size?: "default" | "sm" | "lg" | "icon" | null | undefined }) => {
    const router = useRouter()

    return <Button onPress={() => router.push(`/${id}`)} size={size} variant={"ghost"} className="flex flex-row gap-2 items-center">
        <Text>Details</Text>
        <ExternalLink className="!text-foreground !text-base" />
    </Button>
}

export type SmallListingCardProps = Pick<Listing, "id" | "title" | "price" | "type"> & { user_created: Pick<User, "id" | "avatar"> }

export const RenderMetrics = ({ listingId }: { listingId: string }) => {
    const [metrics, setMetrics] = useState<ListingCardMetrics | null>(null)
    const { colors } = useColorScheme()
    const isFocused = useIsFocused()

    useEffect(() => {
        async function fetchMetrics() {
            const metrics = await getListingMetrics(listingId)
            setMetrics(metrics)
        }
        fetchMetrics()
    }, [isFocused, listingId])

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

export const SmallListingCard = (item: SmallListingCardProps) => {
    return <GoToFullListingButton listingId={item.id} variant={"base"} size={"none"} className="border-solid border-hairline border-border p-4 flex-row gap-4 bg-card items-start">
        <Image source={{ uri: buildAssetUrl(item.user_created.avatar) }} className="w-8 h-8 rounded-full" />
        <View className="flex-col gap-1">
            <View>
                <Text className="text-lg font-bold w-[300px]">{item.title}</Text>
                <View className="flex-row justify-between gap-4 items-center">
                    <Text className="!text-success">AED {Number(item.price).toLocaleString()}</Text>
                    <Text className="border-solid text-info rounded-full border-info border px-2 my-1">{item.type}</Text>
                </View>
            </View>
            <RenderMetrics listingId={item.id} />
        </View>
    </GoToFullListingButton>
}