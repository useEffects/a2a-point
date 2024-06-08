import directusStore from "app/store/directus"
import { useEffect, useState } from "react"
import { aggregate } from "@directus/sdk"
import { View } from "react-native"
import { Text } from "./ui/text"
import { cn } from "app/lib/utils"

export const CompanyStats = ({ className }: { className?: string }) => {
    const { rest } = directusStore()
    const [stats, setStats] = useState<{ title: string, count: number }[]>([])

    useEffect(() => {
        async function getCompanyStats() {
            const getListingsCount = await rest.request(aggregate("listings", {
                aggregate: {
                    count: ["*"]
                }
            }))
            const getUsersCount = await rest.request(aggregate("directus_users", {
                aggregate: {
                    count: ["*"]
                }
            }))
            const listingsCount = getListingsCount?.[0]!.count as unknown as number
            const usersCount = getUsersCount?.[0]!.count as unknown as number
            setStats([
                {
                    title: "Listings",
                    count: listingsCount
                },
                {
                    title: "Users",
                    count: usersCount
                }
            ])
        }
        getCompanyStats()
    }, [rest])

    return <View className={cn("flex-row justify-between", className)}>
        {stats.map(stat => <View key={stat.title}>
            <View className="flex-col gap-4 justify-center items-start w-24 h-24">
                <Text className="">{stat.title}</Text>
                <Text className="text-center text-5xl font-bold">{stat.count}+</Text>
            </View>
        </View>)}
    </View>
}