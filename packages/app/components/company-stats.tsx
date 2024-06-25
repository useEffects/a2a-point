import { getCompaniesCount, getListingsCount, getLocationsCount, getUsersCount } from "app/lib/misc/get-counts"
import { cn } from "app/lib/utils"
import directusStore from "app/store/directus"
import { useEffect, useState } from "react"
import { View } from "react-native"
import { Text } from "./ui/text"
import { HorizontalFlatList } from "./utils/virtual-lists"

export const CompanyStats = ({ className }: { className?: string }) => {
    const { rest } = directusStore()
    const [stats, setStats] = useState<{ title: string, count: number }[]>([])

    useEffect(() => {
        async function getCompanyStats() {
            const listingsCount = await getListingsCount()
            const usersCount = await getUsersCount()
            const companiesCount = await getCompaniesCount()
            const locationsCount = await getLocationsCount()
            setStats([
                {
                    title: "Listings",
                    count: listingsCount
                },
                {
                    title: "Users",
                    count: usersCount
                },
                {
                    title: "Companies",
                    count: companiesCount
                },
                {
                    title: "Locations",
                    count: locationsCount
                }
            ])
        }
        getCompanyStats()
    }, [rest])

    return <View className={cn("flex-row justify-between", className)}>
        <HorizontalFlatList
            data={stats}
            keyExtractor={item => item.title}
            numRows={2}
            renderItem={({ item: stat, row, col }) =>
                <View className={cn("flex-col gap-4 justify-center items-start w-24 h-24", col === 1 && "ml-12", row === 1 && "mt-4")}>
                    <Text className="">{stat.title}</Text>
                    <Text className="text-center text-5xl font-semibold">{stat.count}+</Text>
                </View>
            }
        />
    </View>
}