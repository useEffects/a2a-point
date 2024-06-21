import { Header } from "app/components/header"
import { Text } from "app/components/ui/text"
import { View } from "react-native"
import { useParams } from "solito/navigation"
import { MembersListScreenComponent } from "app/screens/members-list"
import { useEffect, useState } from "react"
import directusStore from "app/store/directus"
import { readItem } from "@directus/sdk"

export const MembersList = () => {
    const params = useParams()
    const [title, setTitle] = useState("Members")
    const { rest } = directusStore()

    useEffect(() => {
        if (!params.locationId) {
            return
        }
        rest.request(readItem("rooms", params.locationId as string, {
            fields: ["title"]
        })).then((res) => {
            setTitle(`Members in ${res.title}`)
        })
    }, [params])

    if (!params.locationId) {
        return <></>
    }

    return <View className="flex-1 flex-col gap-4">
        <Header>
            <Text className="text-xl font-bold">{title}</Text>
        </Header>
        <MembersListScreenComponent locationId={params.locationId as string} />
    </View>
}