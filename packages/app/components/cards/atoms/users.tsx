import { Text } from "app/components/ui/text"
import { buildAssetUrl } from "app/lib/helpers"
import { Company, User } from "app/lib/types"
import { cn } from "app/lib/utils"
import { Image, Platform, View } from "react-native"
import { Award, Building2, Star } from "app/components/icons"
import { useQuery } from "@tanstack/react-query"
import { getFeedbacksCountForUser, getListingsCountForUser } from "app/lib/misc/get-counts"
import { Separator } from "app/components/ui/separator"
import { GoToProfileButton } from "app/components/link-buttons"
import opacity from "hex-color-opacity"
import { useColorScheme } from "app/hooks/color-scheme"

export type SmallUsersCardProps = Pick<User, "id" | "avatar" | "first_name" | "last_name" | "computed_rating"> & { company: Pick<Company, "title"> | null }

export const smallUsersFields = ["id", "avatar", "first_name", "last_name", "computed_rating", "company.title"]

export const SmallUsersCard = (item: SmallUsersCardProps) => {
    const { colors } = useColorScheme()
    const { data: ratingsCount } = useQuery({
        queryKey: ["ratingsCount", item.id],
        queryFn: async () => await getFeedbacksCountForUser(item.id)
    })
    const { data: listingsCount } = useQuery({
        queryKey: ["listingsCount", item.id],
        queryFn: async () => await getListingsCountForUser(item.id)
    })

    return <GoToProfileButton variant={"base"} size={"none"} userId={item.id} className={cn("rounded-xl relative", Platform.OS !== "web" && "w-44")}>
        <View className="w-full h-10 flex-col justify-center items-start">
            <View className="flex-row items-center rounded p-1" style={{ backgroundColor: opacity(colors.primary, 0.1) }}>
                <Award size={12} className="text-primary" />
                <Text className="text-primary text-xs">Pro</Text>
            </View>
        </View>
        <View className="h-8 w-full bg-card rounded-tl-xl rounded-tr-xl" />
        <Image className="rounded-full w-20 h-20 absolute top-0 z-10 left-12 border border-background border-4" source={{ uri: buildAssetUrl(item.avatar) }} />
        <View className={cn("rounded-bl-xl w-full")}>
            <View className="p-4 bg-card flex-col justify-between rounded-bl-xl rounded-br-xl h-[175px]">
                <Text className="font-medium">{item.first_name} {item.last_name}</Text>
                <View className="flex-row justify-between">
                    <View className="flex-row items-center gap-1">
                        <Star size={18} className="text-success" />
                        <Text className="text-success">{item.computed_rating}</Text>
                    </View>
                    <View className="flex-row items-center gap-1">
                        <Text className="text-subtext">{ratingsCount}</Text>
                        <Text className="text-subtext">ratings</Text>
                    </View>
                </View>
                {item.company && <View className="flex-row items-center gap-1 flex-wrap">
                    <Building2 size={18} className="text-info" />
                    <Text className="text-sm text-info">{item.company.title}</Text>
                </View>}
                <Separator />
                <View className="flex-row gap-1 items-center">
                    <Text className="text-xl font-normal text-primary">{listingsCount}</Text>
                    <Text className="text-subtext">listings</Text>
                </View>
            </View>
        </View>
    </GoToProfileButton>
}