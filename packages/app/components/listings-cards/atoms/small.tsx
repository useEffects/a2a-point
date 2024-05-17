import { useRouter } from "solito/router"
import { useEffect, useState } from "react"
import { View, Image } from "react-native"
import { buildAssetUrl, getListingMetrics } from "app/lib/helpers"
import { Listing, User } from "app/lib/types"
import { Text } from "app/components/ui/text"
import { Button } from "app/components/ui/button"
import { Feather, Ionicons } from '@expo/vector-icons';
import { ListingCardMetrics } from "./full"
import { useIsFocused } from "@react-navigation/native"

export const OpenDetailsButton = ({ id, size = "sm" }: { id: string, size?: "default" | "sm" | "lg" | "icon" | null | undefined }) => {
    const router = useRouter()

    return <Button onPress={() => router.push(`/${id}`)} size={size} variant={"ghost"} className="flex flex-row gap-2 items-center">
        <Text>Details</Text>
        <Feather name="external-link" className="!text-foreground !text-base" />
    </Button>
}

export type SmallListingCardProps = Pick<Listing, "id" | "title" | "price" | "address" | "type"> & { user_created: Pick<User, "id" | "avatar"> }

export const RenderMetrics = ({ listingId }: { listingId: string }) => {
    const [metrics, setMetrics] = useState<ListingCardMetrics | null>(null)
    const isFocused = useIsFocused()

    useEffect(() => {
        async function fetchMetrics() {
            const metrics = await getListingMetrics(listingId)
            setMetrics(metrics)
        }
        fetchMetrics()
    }, [isFocused, listingId])

    return <View className="flex-row gap-4">
        {metrics ? <>
            <View className="flex-row gap-2">
                <Ionicons name="eye" className="!text-foreground !text-base" />
                <Text>{metrics.views}</Text>
            </View>
            <View className="flex-row gap-2">
                <Ionicons name="bookmark" className="!text-foreground !text-base" />
                <Text>{metrics.saves}</Text>
            </View>
        </> : <></>}
    </View>

}

export const SmallListingCard = (item: SmallListingCardProps) => {
    const router = useRouter()

    return <Button onPress={() => router.push(`/${item.id}`)} variant={"ghost"} size={"none"} className="border-solid border-hairline border-border p-4 flex-row gap-4 bg-card items-start">
        <Image source={{ uri: buildAssetUrl(item.user_created.avatar) }} className="w-8 h-8 rounded-full" />
        <View className="flex-col gap-1">
            <View>
                <Text className="text-lg font-medium w-[300px]">{item.title}</Text>
                <Text className="!text-subtext">{item.address}</Text>
                <View className="flex-row justify-between gap-4 items-center">
                    <Text className="!text-subtext">AED {Number(item.price).toLocaleString()}</Text>
                    <Text className="border-solid rounded-full border-foreground border px-2 my-1">{item.type}</Text>
                </View>
            </View>
            <RenderMetrics listingId={item.id} />

        </View>
    </Button>
}