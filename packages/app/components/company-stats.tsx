import { cn } from "app/lib/utils"
import { View } from "react-native"
import { Text } from "./ui/text"
import { Building2, MapPin, TrendingUp, Users } from "app/components/icons"
import { groupByN } from "app/lib/helpers"

export const CompanyStats = ({ className, right, counts }: {
    className?: string, right?: boolean, counts: {
        listingsCount: number,
        usersCount: number,
        companiesCount: number,
        locationsCount: number
    }
}) => {

    const stats = [
        {
            title: "Listings",
            count: counts.listingsCount,
            icon: TrendingUp
        },
        {
            title: "Agents",
            count: counts.usersCount,
            icon: Users
        },
        {
            title: "Companies",
            count: counts.companiesCount,
            icon: Building2
        },
        {
            title: "Locations",
            count: counts.locationsCount,
            icon: MapPin
        }
    ]

    return <View className={cn("flex-col w-full", className)}>
        {groupByN(stats).map((group, i) => <View key={i} className="flex-row gap-4 w-full">
            {group.map(({ title, count, icon }, j) => {
                const Icon = icon
                return <View key={j} className="flex-grow">
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