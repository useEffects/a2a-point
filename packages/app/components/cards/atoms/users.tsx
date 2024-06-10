import { Text } from "app/components/ui/text"
import { buildAssetUrl, timeAgo } from "app/lib/helpers"
import { Company, User } from "app/lib/types"
import { cn } from "app/lib/utils"
import { Image, View } from "react-native"
import { AtSign, Award, Building2, Star } from "app/components/icons"
import { useQuery } from "@tanstack/react-query"
import { getFeedbacksCountForUser, getListingsCountForUser } from "app/lib/misc/get-counts"
import { Separator } from "app/components/ui/separator"
import { GoToProfileButton } from "app/components/link-buttons"
import opacity from "hex-color-opacity"
import { useColorScheme } from "app/hooks/color-scheme"
import { Link } from "solito/link"
import { CompanyChip } from "./company"

export type SmallUsersCardProps = Pick<User, "id" | "avatar" | "first_name" | "last_name" | "computed_rating"> & { company: Pick<Company, "title" | "avatar" | "id"> | null }
export type MediumUsersCardProps = Pick<User, "id" | "avatar" | "first_name" | "last_name" | "computed_rating" | "tags" | "email" | "last_access"> & { company: Pick<Company, "title" | "avatar" | "id"> | null }

export const smallUsersFields = ["id", "avatar", "first_name", "last_name", "computed_rating", "company.title", "company.avatar", "company.id"]
export const mediumUsersFields = ["id", "avatar", "first_name", "last_name", "computed_rating", "tags", "company.title", "company.avatar", "email", "last_access"]

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

    return <GoToProfileButton variant={"base"} size={"none"} userId={item.id} className={cn("rounded-xl relative w-44")}>
        <View className="w-full h-10 flex-col justify-center items-start">
            <View className="flex-row items-center rounded p-1" style={{ backgroundColor: opacity(colors.primary, 0.1) }}>
                <Award size={12} className="text-primary" />
                <Text className="text-primary text-xs">Pro</Text>
            </View>
        </View>
        <View className="h-8 w-full bg-card rounded-tl-xl rounded-tr-xl" />
        <Image className="rounded-full w-20 h-20 absolute top-0 z-10 left-12 border border-background border-4" source={{ uri: buildAssetUrl(item.avatar) }} />
        <View className="p-4 bg-card flex-col justify-between rounded-bl-xl rounded-br-xl h-[175px] w-full">
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
            {item.company && <CompanyChip {...item.company} />}
            <Separator />
            <View className="flex-row gap-1 items-center">
                <Text className="text-primary">{listingsCount}</Text>
                <Text className="text-subtext">listings</Text>
            </View>
        </View>
    </GoToProfileButton>
}

export const MediumUsersCard = (item: MediumUsersCardProps) => {
    const { colors } = useColorScheme()
    const { data: ratingsCount } = useQuery({
        queryKey: ["ratingsCount", item.id],
        queryFn: async () => await getFeedbacksCountForUser(item.id)
    })
    const { data: listingsCount } = useQuery({
        queryKey: ["listingsCount", item.id],
        queryFn: async () => await getListingsCountForUser(item.id)
    })
    return <GoToProfileButton userId={item.id} className="w-full flex-row items-start w-full justify-start">
        <View className="w-1/2 rounded-tl-xl">
            <View className="relative flex-col items-start w-full">
                <View className="h-8 bg-background w-full pl-20 flex-row items-center gap-1">
                    <Text className="text-primary">{listingsCount}</Text>
                    <Text className="text-subtext">leads posted</Text>
                </View>
                <View className="absolute" style={{ elevation: 100, zIndex: 100 }}>
                    <Image className="w-16 h-16 rounded-full border border-background border-1" source={{ uri: buildAssetUrl(item.avatar) }} />
                </View>
                <View className="h-8 bg-card w-full pl-20 flex-row items-center justify-between gap-4 pr-4 rounded-tl-xl">
                    <View className="flex-row gap-1 items-center">
                        <Star size={18} className="text-success" />
                        <Text className="text-success">{item.computed_rating}</Text>
                    </View>
                    <View className="flex-row gap-1 items-center">
                        <Text className="text-sm text-subtext">Ratings</Text>
                        <Text className="text-sm text-subtext">{ratingsCount}</Text>
                    </View>
                </View>
            </View>
            <View className="w-full flex-col gap-4 p-4 bg-card rounded-bl-xl flex-1">
                <View className="flex-col gap-2">
                    <Text className="font-medium">{item.first_name} {item.last_name}</Text>
                    <Link href={`mailto:${item.email}`}>
                        <View className="flex-row items-center gap-1">
                            <AtSign size={16} className="text-info" />
                            <Text className="text-info underline">{item.email}</Text>
                        </View>
                    </Link>
                </View>
            </View>
        </View>
        <View className="w-1/2 bg-background flex-col">
            <View className="h-8 w-full" />
            <View className="p-4 pt-2 flex-1 flex-col justify-between gap-2 items-start rounded-tr-xl rounded-br-xl bg-card">
                <Text className="text-sm text-subtext">last seen {timeAgo.format(new Date(item.last_access))}</Text>
                <View className="flex-row gap-2 items-center flex-wrap">
                    {item.tags?.map((tag, i) => <Text key={i} style={{ backgroundColor: opacity(colors.success, 0.1) }} className="text-sm text-success px-1 rounded">{tag}</Text>)}
                </View>
                {item.company && <CompanyChip avatar={item.company.avatar} title={item.company.title} id={item.company.title} />}
            </View>
        </View>
    </GoToProfileButton>
}