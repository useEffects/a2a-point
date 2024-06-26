import { getCompaniesCount, getListingsCount, getLocationsCount, getUsersCount } from "app/lib/misc/get-counts"
import { cn } from "app/lib/utils"
import directusStore from "app/store/directus"
import { useEffect, useState } from "react"
import { View } from "react-native"
import { Text } from "./ui/text"
import { Building2, MapPin, TrendingUp, Users } from "app/components/icons"
import { groupByN } from "app/lib/helpers"
import { LucideIcon } from "lucide-react-native"

export const CompanyStats = ({ className, right }: { className?: string, right?: boolean }) => {
    const { rest } = directusStore()
    const [stats, setStats] = useState<{ title: string, count: number, icon: LucideIcon }[]>([])

    useEffect(() => {
        async function getCompanyStats() {
            const listingsCount = await getListingsCount()
            const usersCount = await getUsersCount()
            const companiesCount = await getCompaniesCount()
            const locationsCount = await getLocationsCount()
            setStats([
                {
                    title: "Listings",
                    count: listingsCount,
                    icon: TrendingUp
                },
                {
                    title: "Agents",
                    count: usersCount,
                    icon: Users
                },
                {
                    title: "Companies",
                    count: companiesCount,
                    icon: Building2
                },
                {
                    title: "Locations",
                    count: locationsCount,
                    icon: MapPin
                }
            ])
        }
        getCompanyStats()
    }, [rest])

    return <View className={cn("flex-col", className)}>
        {groupByN(stats).map((group, i) => <View key={i} className="flex-row gap-4">
            {group.map(({ title, count, icon }, j) => {
                const Icon = icon
                return <View key={j} className="w-28">
                    <View className={cn("flex-row items-end gap-1", right && "justify-end")}>
                        <Text className="text-6xl font-bold">{count}</Text>
                        <Text className="text-2xl font-bold mb-1">+</Text>
                    </View>
                    <View className={cn("flex-row items-center gap-2", right && "justify-end")}>
                        <Icon className="text-subtext" size={18} />
                        <Text className="text-subtext">{title}</Text>
                    </View>
                </View>
            })}
        </View>)}
    </View>
}