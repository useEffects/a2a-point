import { readItem } from "@directus/sdk"
import { useQuery } from "@tanstack/react-query"
import { useGlobalSearchParams, useNavigation } from "expo-router"
import { useEffect } from "react"
import { ScrollView, View } from "react-native"
import Profile from "~/components/profile"
import { Text } from "~/components/ui/text"
import { directusUrl } from "~/lib/constants"
import directusStore from "~/store/directus"
import { User } from "~/types"

export default function UserProfileScreen() {
    const { userId } = useGlobalSearchParams()
    const { token } = directusStore()
    const navigator = useNavigation()

    const data = useQuery({
        queryKey: ["fetch-another-user", userId],
        queryFn: async () => await fetch(`${directusUrl}/users/${userId}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }).then(res => res.json()),
        enabled: !!userId
    }) as { data: { data: User }, isLoading: boolean }

    useEffect(() => {
        navigator.setOptions({
            headerTitle: data.data?.data.first_name + " " + data.data?.data.last_name,
        })
    }, [data])

    return data.data ? <ScrollView>
        <Profile user={data.data.data} />
    </ScrollView> : <View></View>
}